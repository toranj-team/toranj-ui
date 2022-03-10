'use strict';

var gulp = require('gulp'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename');

gulp.task('build-css', function () {
    return gulp.src([
            'src/components/lib/' + '**/*.scss'
        ])
        .pipe(gulp.dest('dist/' + 'resources'))
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(rename('toranj-ui.min.css'))
        .pipe(gulp.dest('dist/' + 'resources'));
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

gulp.task('build-resources', gulp.series('build-css','build-meta'));