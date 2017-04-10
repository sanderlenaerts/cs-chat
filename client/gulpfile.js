'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const tsc = require('gulp-typescript');
const tsConfig = require('./tsconfig.json');

const tsProject = tsc.createProject('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const sysBuilder = require('systemjs-builder');

const htmlreplace = require('gulp-html-replace');

gulp.task('sass', function() {
    return gulp.src('./app/sass/**/*.sass')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./dist/assets/css'));
});

// Base option maintains folder structure
gulp.task('images', function() {
    return gulp.src('./assets/images/**/*', {base: '../client/assets/images'})
        .pipe(imagemin())
        .pipe(gulp.dest('../dist/assets/images'))
});

// Bundle dependencies into vendors file
gulp.task('bundle:libs', function () {
    return gulp.src([
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.src.js',
        'systemjs.config.js',
      ])
        .pipe(concat('vendors.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/lib/'));
});

// Compile TypeScript to JS
gulp.task('compile:ts', function () {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/'));

});


gulp.task('sass:w', ['sass'], function() {
    gulp.watch('./app/sass/**/*.sass', ['sass']);
    //gulp.watch('./dist/assets/images/**/*.+(jpg|jpeg|gif|png)', ['images']);
    //gulp.watch('./**/*.html';, ['html']);
    //gulp.watch('./js/**/*', ['js']);
});

gulp.task('compile', ['sass', 'compile:ts', 'assets', 'bundle:libs']);

gulp.task('assets', function(){
    gulp.src([
        './app/assets/**/*.*',
    ])
    .pipe(gulp.dest('./dist/assets/'));

})

// Generate systemjs-based builds
gulp.task('bundle:js', function() {
    var builder = new sysBuilder('./', './systemjs.config.js');
    return builder.buildStatic('app', 'dist/app.js', {minify: false});
});

// Development task watching sass, watching typescript file changes and bundling libraries
gulp.task('dev', ['sass:w']);

//Default task for deployment compiling sass and typescript and bundling libraries
gulp.task ('default', ['sass', 'compile:ts', 'bundle:libs']);
