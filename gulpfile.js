'use strict';

var del = require('del');
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    flatten = require('gulp-flatten');

gulp.task('build-css', function () {
    return gulp.src([
        'src/components/lib/' + 'common/common.css',
        'src/components/lib/' + '**/*.css'
    ])
        .pipe(concat('toranjui.css'))
        .pipe(gulp.dest('dist/' + 'resources'))
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(rename('toranjui.min.css'))
        .pipe(gulp.dest('dist/' + 'resources'));
});


gulp.task('images', function () {
    return gulp.src(['src/components/lib/' + '**/images/*.png', 'src/components/lib/' + '**/images/*.gif'])
        .pipe(flatten())
        .pipe(gulp.dest('dist/' + 'resources/images'));
});

gulp.task('build-exports', function () {
    return gulp.src(['exports/*.js', 'exports/*.d.ts'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('build-meta', function () {
    return gulp.src(['README.md', 'LICENSE.md', 'package-build.json'])
        .pipe(rename(function (path) {
            if (path.basename === 'package-build') {
                path.basename = path.basename.replace('package-build', 'package');
            }
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-css', function () {
    return gulp.src([
        'src/components/lib/' + '**/common.css',
        'src/components/lib/' + '**/*.css'
    ])
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(rename(function (path) {
            path.basename = path.basename.toLowerCase();
            path.extname = '.min' + path.extname;
        }))
        .pipe(gulp.dest('./' + 'dist/'));
});

gulp.task('remove-extra-types', function () {
    return del('dist/**/types', { force: true });
});

gulp.task('copy-package.json', function () {
    return gulp.src('src/components/lib/' + '**/package.json')
        .pipe(gulp.dest('./' + 'dist/'));
});

//Building project with run sequence
gulp.task('copy-files', gulp.series('copy-css', 'copy-package.json'));
gulp.task('build-resources', gulp.series('build-css', 'images', 'build-meta', 'copy-files', 'remove-extra-types'));