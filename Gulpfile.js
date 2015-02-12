var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var util = require('gulp-util');
var gulpprint = require('gulp-print');
var gulpif = require('gulp-if');
var args = require('yargs').argv;

gulp.task('vet', function(){
   return gulp.src([
     './src/**/*.js',
     './.js'
   ])
   .pipe(gulpif(args.verbose , gulpprint()))
   .pipe(jscs())
   .pipe(jshint())
   .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
   .pipe(jshint.reporter('fail'));
});

gulp.task('hello-world', function(){
  console.log('teask');
});
