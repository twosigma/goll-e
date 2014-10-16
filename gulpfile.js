/**
 * Task runner definitions file.
 */

var path = require('path');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');

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

var sourceFiles = [path.join('lib', '**', '*.js')]; 
var testFiles = [path.join('test', 'test-*.js')];
var distDir = 'dist';
var coverageDir = 'coverage';
var distributables = [path.join(distDir, '**', '*')];

/**
 * Default mocha test runner setup.
 */
var mochaDefault = mocha({
    reporter: 'spec',
    globals: {
        should: require('should')
    }
});

gulp.task('static-analysis', function () {
    'use strict';

    return gulp.src(sourceFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

/**
 * Task definition for running unit tests.
 */
gulp.task('tests', function () {
    'use strict';
    
    return gulp.src(testFiles, { 
        read: false
    }).pipe(mochaDefault);
});

/**
 * Task definition for running unit tests with coverage.
 */
gulp.task('coverage', function () {
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
 * Task for bundling and minifying the javascript.
 */
gulp.task('browserify', function () {
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
        .pipe(gulp.dest(distDir))
        .pipe(rename(outputMin))
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
    del(path.join(coverageDir, '**', '*'));
});

