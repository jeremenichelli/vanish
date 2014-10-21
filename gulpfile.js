var gulp = require('gulp'),
    concat = require('gulp-concat'),
    concatUtil = require('gulp-concat-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    package = require('./package.json');

var header = '// ' + package.title + ' - ' + package.author + '\n' +
    '// ' + package.repository.url + ' - MIT License\n\n',
    scripts = {
        dep: 'dep/scripts/*.js',
        src: 'src/scripts/*.js',
        dist: 'dist/scripts/*.js',
        output: 'dist/scripts'
    };

gulp.task('hint', function () {

    return gulp.src(scripts.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', function (e) {
            gutil.log(gutil.colors.red('JSHint error'), gutil.colors.gray('for vanish.js source file'));
        });
})

gulp.task('build', [ 'hint'], function () {

    gutil.log(gutil.colors.magenta('Building vanish...'));

    gulp.src([ scripts.dep, scripts.src])
        .pipe(concat('vanish.js'))
        .pipe(concatUtil.header(header))
        .pipe(gulp.dest(scripts.output))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(scripts.output));

    gutil.log(gutil.colors.magenta('Building unbundled version of vanish...'));

    gulp.src(scripts.src)
        .pipe(concatUtil.header(header))
        .pipe(rename({
            suffix: '.unbundled'
        }))
        .pipe(gulp.dest(scripts.output))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(scripts.output));
});