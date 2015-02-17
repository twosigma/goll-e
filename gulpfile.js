/**
 * Task runner definitions file.
 */

var fs = require('fs');
var path = require('path');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var shell = require('shelljs');

var browserify = require('browserify');
var reactify = require('reactify');

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var symlink = require('gulp-symlink');
var react = require('gulp-react');

var gollePackage = require('./package.json');

/**
 * Generates a bundle name for the current version of GOLL-E.
 */
var getBundleName = function ( descriptors ) {
    'use strict';

    // Default value - empty array.
    descriptors = descriptors || [];

    var name = gollePackage.name;
    var extra = descriptors.reduce(function (previousValue, currentValue) {
        return previousValue + "." + currentValue;
    }, '');

    return extra === '' ? name  : name + extra;
};

var paths = {
    sourceFiles: [path.join('lib', '**', '*.js'),
                  path.join('lib', '**', '*', '*.jsx')],
    testFiles: [path.join('test', '**', 'test-*.js')],
    distributables: [path.join('dist', '**', '*')],
    distDir: 'dist',
    coverageDir: 'coverage'
};

/**
 * Default mocha test runner setup.
 */
var mochaDefault = mocha({
    reporter: 'spec',
    globals: {
        should: require('should')
    }
});

/**
 * Task definition for generating parsers using jison. 
 */
gulp.task('jison', [], function () {
    'use strict';

    // There are three parsers to generate.
    // For now, we only care about the content language parser.
    var parserNames = ['gcl'];

    // Start generating parsers.
    parserNames.forEach(function (value, index, array) {
        // Build out complete paths for the grammar and lexer files.
        var grammarFile = path.join('jison', value + '.jison');
        var lexerFile = grammarFile + 'lex';
        var destination = 'jison';
        var jisonCmdPath = path.join('node_modules', 'jison', 'lib', 'cli.js');
    
        // Build up the shell command to run to generate the parser.
        var cmd = jisonCmdPath + ' ' + grammarFile + ' ' + lexerFile + ' --module-type commonjs';

        // Run the command.
        shell.exec(cmd);
        shell.mv('-f', value + '.js', destination); 
    });
});

/**
 * Task definition for performing static analysis against the lib directory.
 */
gulp.task('lint', ['build'], function () {
    'use strict';

    return gulp.src(paths.sourceFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

/**
 * Task definition for running unit tests.
 */
gulp.task('mocha', ['lint', 'jison'], function () {
    'use strict';
    
    return gulp.src(paths.testFiles, { 
        read: false
    }).pipe(mochaDefault);
});

/**
 * Task definition for running unit tests with coverage.
 */
gulp.task('coverage', ['lint', 'build'], function () {
    'use strict';
    
    return gulp.src(paths.sourceFiles)
        .pipe(react())
        .pipe(istanbul())
        .on('finish', function () {
            gulp.src(paths.testFiles)
                .pipe(mochaDefault)
                .pipe(istanbul.writeReports(paths.coverageDir));
    });
});

/**
 * Task definition for bundling up the project files into a single JS file.
 */
gulp.task('browserify', ['jison'], function () {
    'use strict';

    var mainFile = 'main.jsx';
    var sourceFile = path.join('lib', mainFile);
    var outputFile = getBundleName() + '.js';

    
    var bundler = browserify({
        entries: ['.' + path.sep + sourceFile],
    });
    bundler.transform(reactify);
    
    return bundler
        .bundle()
        .pipe(source(outputFile))
        .pipe(gulp.dest(paths.distDir));
});

/**
 * Task definition for minifying distributables.
 */
gulp.task('uglify', ['browserify'], function () {
    'use strict';
  
    var outputFile = getBundleName() + '.js';
    var unminified = [path.join(paths.distDir, outputFile)];
    var minified = getBundleName(['min']) + '.js';

    return gulp.src(unminified)
        .pipe(rename(minified))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.distDir));
});

/**
 * Task definition for symlinking the final build product into public/js.
 * This is done so that the express backend can use the final library.
 */
gulp.task('symlink', ['uglify'], function () {
    'use strict';

    var linkPath = path.join('examples', 'public', 'js', 'goll-e');

    fs.exists(linkPath, function (exists) {
        if(!exists) {
            gulp.src(paths.distDir)
                .pipe(symlink(linkPath));
        }
    });
});

/**
 * Task definition for cleaning out the distributable directory.
 */
gulp.task('clean', function () {
    'use strict';

    del(paths.distributables);
    del(path.join(paths.coverageDir, '**', '*'));
    del(path.join('jison', '*.js'));
});

gulp.task('test', ['build', 'lint', 'coverage']);
gulp.task('build', ['jison', 'browserify', 'uglify', 'symlink']);
gulp.task('ci', ['build', 'test']);


