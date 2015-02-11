/**
 * Task runner definitions file.
 */

var fs = require('fs');
var path = require('path');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var shell = require('shelljs');

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var symlink = require('gulp-symlink');

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
    sourceFiles: [path.join('lib', '**', '*.js')],
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
    
        // Build up the shell command to run to generate the parser.
        var cmd = 'jison ' + grammarFile + ' ' + lexerFile + ' --module-type commonjs';

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
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
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
        .pipe(istanbul({
            includeUntested: true
        }))
        .on('finish', function () {
            gulp.src(paths.testFiles)
                .pipe(mochaDefault)
                .pipe(istanbul.writeReports(paths.coverageDir));
    });
});

/**
 * Task for bundling and minifying the javascript.
 */
gulp.task('browserify', ['jison'], function () {
    'use strict';
    
    var mainFile = 'main.js';
    var sourceFile = path.join('.', 'lib', mainFile);
    var outputFile = getBundleName() + '.js';
    var outputMin = getBundleName(['min']) + ".js";

    var bundler = browserify({
        entries: ['.' + path.sep + sourceFile],
        debug: true
    });
   
    return bundler
        .bundle()
        .pipe(source(outputFile))
        .pipe(gulp.dest(paths.distDir))
        .pipe(rename(outputMin))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.distDir));
});

/**
 * Task definition for symlinking the built final build product into public/js.
 */
gulp.task('symlink_dist', ['browserify'], function () {
    'use strict';

    var linkPath = path.join('public', 'js', 'goll-e');

    fs.exists( linkPath, function (exists) {
        if( !exists ) {
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

gulp.task('test', ['lint', 'coverage']);
gulp.task('build', ['jison', 'browserify']);
gulp.task('ci', ['build', 'test']);


