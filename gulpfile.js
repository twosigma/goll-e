/**
 * Task runner definitions file.
 */

var path = require('path');
var del = require('del');
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
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

    return extra === '' ? name  : name + '.' + extra;
};

var sourceFiles = ['lib/**/*.js'];
var testFiles = ['test/test-*.js'];
var distDir = 'dist';
var coverageDir = 'coverage';
var distributables = [distDir + '/**/*'];

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
 * Task definition for running unit tests.
 */
gulp.task('run-tests', function () {
    'use strict';
    return gulp.src(testFiles, { 
        read: false
    }).pipe(mochaDefault);
});

/**
 * Task definition for running unit tests with coverage.
 */
gulp.task('run-tests-coverage', function () {
    'use strict';
    return gulp.src(sourceFiles) 
        .pipe(istanbul())
        .on('finish', function () {
            gulp.src(testFiles)
                .pipe(mochaDefault)
                .pipe(istanbul.writeReports(coverageDir))
    });
});

/**
 * Task for bundling the javascript.
 */
gulp.task('run-browserify', function () {
    'use strict';

    var mainFile = 'main.js';
    var sourceFile = path.join('.', 'lib', mainFile);
    var outputFile = getBundleName() + '.js';

    var bundler = browserify({
        entries: ['.' + path.sep + sourceFile],
        debug: false
    });
   
    return bundler
        .bundle()
        .pipe(source(outputFile))
        .pipe(gulp.dest(distDir));
});

/**
 * Task for bundling and minifying the javascript.
 */
gulp.task('run-minify', function () {
    'use strict';
    
    var mainFile = 'main.js';
    var sourceFile = path.join('.', 'lib', mainFile);
    var outputFile = getBundleName(['min']) + '.js';

    var bundler = browserify({
        entries: ['.' + path.sep + sourceFile],
        debug: true
    });
   
    return bundler
        .bundle()
        .pipe(source(outputFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distDir));
});

/**
 * Task definition for cleaning out the distributable directory.
 */
gulp.task('clean', function () {
    'use strict';
    del(distributables);
});

