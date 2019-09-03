var gulp = require('gulp'),
    gutil = require('gutil'),
    seq = require('gulp-sequence'),
    config = require('./config.json'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
	concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

gutil.log('Starting Gulp!!');

gulp.task('default', function () {
	return gulp.watch([
		config.source.sass + '/**/*.scss'
	], gulp.parallel('sass-main', 'sass-custom'));
});

gulp.task('sass-main', function () {
	return gulp.src([
			'materialize.scss',
			'style.scss',
		], { cwd: config.source.sass})
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
            browsers: config.autoprefixerBrowsers,
            cascade: false
        }))
		.pipe(gulp.dest(config.destination.css));
});

gulp.task('sass-custom', function () {
	return gulp.src([
			'custom/*.scss'
		], { cwd: config.source.sass})
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
            browsers: config.autoprefixerBrowsers,
            cascade: false
        }))
		.pipe(concat('custom.css'))
		.pipe(gulp.dest(config.destination.css));
});