// require modules
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify');

// list source files
var jsSources = [
  'public/js/app.js',
  'public/js/controllers/drawboardCtrl.js',
  'public/js/controllers/headerCtrl.js',
  'public/js/controllers/gradientsCtrl.js',
  'public/js/services/socketFactory.js',
  'public/js/services/assetLibrary.js',  
  'public/js/directives/onSizeChanged.js',
  'public/lib/ng-color-picker/color-picker.js'
];
var htmlSources = [
  'public/*.html'
];
var scssSources = [
  'public/scss/*.scss'
];

// define tasks
gulp.task('jshint', function() {
  gulp.src(jsSources)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish-ex'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('sass', function() {
  return gulp.src(scssSources)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('minify', function() {
  gulp.src('public/js/script.js')
    .pipe(minify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['jshint', 'js']);
  gulp.watch(scssSources, ['sass']);
});

//  run tasks
gulp.task('default', ['jshint', 'sass', 'js', 'watch']);
