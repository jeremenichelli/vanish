var gulp = require('gulp'),
    concat = require('gulp-concat'),
    concatUtil = require('gulp-concat-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    package = require('./package.json');

var header = '// ' + package.title + ' - ' + package.author + '\n' +
    '// ' + package.repository.url + ' - MIT License\n\n',
    scripts = {
        dep: 'dep/scripts/*.js',
        src: 'src/scripts/*.js',
        dist: 'dist/scripts/*.js',
        output: 'dist/scripts'
    }

gulp.task('hint', function () {
    return gulp.src(scripts.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('dist', [ 'hint' ] ,function () {
    return gulp.src([ scripts.dep, scripts.src])
        .pipe(concat('vanish.js'))
        .pipe(concatUtil.header(header))
        .pipe(gulp.dest(scripts.output))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(scripts.output))
});