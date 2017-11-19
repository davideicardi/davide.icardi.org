"use strict";

const gulp = require('gulp');
const browserify = require('browserify');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const del = require('del');
const spawn = require('child_process').spawn;

const path = require('path');
const myPath = {
  cssBuild: './.gulp/css',
  jsBuild: './.gulp/js'
};

gulp.task('scss', () => {
  return gulp.src('./client/**/*.scss')
  .pipe(sass())
  .on('error', gutil.log)
  .pipe(gulp.dest(myPath.cssBuild));
});

gulp.task('vendor-css', () => {
  return gulp.src(
    ['./node_modules/bootstrap/dist/css/bootstrap.css'])
    .on('error', gutil.log)
    .pipe(gulp.dest(myPath.cssBuild));
  });

gulp.task('browserify', () => {
  var b = browserify({
    entries: './client/app.js',
    debug: true
  })
  .transform("babelify", {presets: ["es2015"]});

  return b.bundle()
  .pipe(source('./client/app.js'))
  .pipe(buffer())
  .pipe(concat('all.js'))
  .on('error', gutil.log)
  .pipe(gulp.dest(myPath.jsBuild));
});

gulp.task('stylesheet', ['clean:css', 'scss', 'vendor-css'], () => {
  return gulp.src(path.join(myPath.cssBuild, '**/*.css'))
  .pipe(concat('all.css'))
  .on('error', gutil.log)
  .pipe(gulp.dest('./wwwroot'));
});

gulp.task('stylesheet-min', ['stylesheet'], () => {
  return gulp.src('./wwwroot/all.css')
  .pipe(minifyCss({compatibility: 'ie8'}))
  .pipe(rename({
    extname: '.min.css'
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest('./wwwroot'));
});

gulp.task('stylesheet:watch', function () {
  return gulp.watch('./client/**/*.scss', ['stylesheet-min']);
});

gulp.task('javascript', ['clean:js', 'browserify'], () => {
  return gulp.src(path.join(myPath.jsBuild, '**/*.js'))
  .pipe(concat('all.js'))
  .on('error', gutil.log)
  .pipe(gulp.dest('./wwwroot'));
});

gulp.task('javascript-min', ['javascript'], () => {
  return gulp.src('./wwwroot/all.js')
  .pipe(uglify())
  .pipe(rename({
    extname: '.min.js'
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest('./wwwroot'));
});

gulp.task('javascript:watch', function () {
  return gulp.watch('./client/**/*.js', ['javascript-min']);
});

gulp.task('clean:js', function () {
  return del([
    path.join(myPath.jsBuild, '**/*.*'),
    './wwwroot/all.js',
    './wwwroot/all.min.js'
  ]);
});

gulp.task('clean:css', function () {
  return del([
    path.join(myPath.cssBuild, '**/*.*'),
    './wwwroot/all.css',
    './wwwroot/all.min.css'
  ]);
});

gulp.task('build', ['stylesheet-min', 'javascript-min'], () => {
});
gulp.task('build:watch', ['build', 'stylesheet:watch', 'javascript:watch'], () => {
});

let server_process;
gulp.task('server', function() {
  if (server_process) server_process.kill()
  server_process = spawn('node', ['./server/index.js'], {stdio: 'inherit'})
  server_process.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });

  // clean up if an error goes unhandled.
  process.on('exit', function() {
      if (server_process) server_process.kill()
  });
});

gulp.task('develop', ['server', 'build:watch'], function() {
  return gulp.watch(['server/**/*.js', 'client/**/*.jade'], ['server']);
});

gulp.task('default', function() {
  // place code for your default task here
});
