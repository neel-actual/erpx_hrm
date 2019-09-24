var gulp = require('gulp'),
    gutil = require('gutil'),
    seq = require('gulp-sequence'),
    config = require('./config.json'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
	concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
	_bs = require('browser-sync').create();

gutil.log('Starting Gulp!!');

gulp.task('default', function () {
	return gulp.watch([
		config.source.sass + '/**/*.scss'
	], gulp.parallel('sass'));
});

gulp.task('sass', function () {
	return gulp.src([
			'materialize.scss',
			'style.scss',
			'custom/*.scss',
			'layout/*.scss'
		], { cwd: config.source.sass})
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
            browsers: config.autoprefixerBrowsers,
            cascade: false
        }))
		.pipe(gulp.dest(config.destination.css));
});

gulp.task('BSync', function () {
	_bs.init({
		proxy: 'localhost:8000'
	});

	gulp.watch([
		'www/**/*.css',
		'www/**/*.html',
		'www/**/*.js'
	]).on('change', _bs.reload);
});