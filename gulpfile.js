'use strict';

var gulp = require('gulp'),
    // concat = require('gulp-concat'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    flatten = require('gulp-flatten');

const sass = require('gulp-sass')(require('sass'))
// const purgecss = require('gulp-purgecss')

gulp.task('build-css', function () {
    return gulp.src('src/styles/lib/**/*.scss')
        .pipe(sass())
        // .pipe(purgecss({ content: ['*.html'] }))
        // .pipe(concat('tui.css'))
        .pipe(gulp.dest('toranj-ui/' + 'resources'))
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(rename('tui.min.css'))
        .pipe(gulp.dest('toranj-ui/' + 'resources'));
});


gulp.task('images', function () {
    return gulp.src(['src/components/lib/' + '**/images/*.png', 'src/components/lib/' + '**/images/*.gif'])
        .pipe(flatten())
        .pipe(gulp.dest('toranj-ui/' + 'resources/images'));
});

gulp.task('build-meta', function () {
    return gulp.src(['README.md', 'LICENSE.md', 'package-build.json'])
        .pipe(rename(function (path) {
            if (path.basename === 'package-build') {
                path.basename = path.basename.replace('package-build', 'package');
            }
        }))
        .pipe(gulp.dest('toranj-ui/'));
});


gulp.task('copy-types', function () {
    return gulp.src('toranj-ui/types/components/lib/**/*')
        .pipe(gulp.dest('./' + 'toranj-ui/'));
});

gulp.task('copy-package.json', function () {
    return gulp.src('src/components/lib/' + '**/package.json')
        .pipe(gulp.dest('./' + 'toranj-ui/'));
});

// Building project with run sequence
gulp.task('copy-files', gulp.series('copy-package.json', 'copy-types'));
gulp.task('build-resources', gulp.series('build-css', 'images', 'build-meta', 'copy-files'));