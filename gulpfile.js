'use strict';

// Include Gulp & Tools
var gulp = require('gulp'),
    premailer = require('gulp-premailer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    browserSync = require('browser-sync'),
    imagemin    = require('gulp-imagemin'),
    gutil = require('gulp-util'),
    filter = require('gulp-filter'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    del = require('del');


// Compile all SCSS files to CSS and copy to app/css
gulp.task('sass', function() {
  return gulp.src('app/sass/*.scss')
       .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            gutil.beep();
            this.emit('end');
        }))
       .pipe(sourcemaps.init())
       .pipe(sass())
       .pipe(sourcemaps.write('./maps'))
       .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: true
        }))
       .pipe(gulp.dest('app/css'))
       .pipe(filter('**/*.css'))
       .pipe(browserSync.reload({stream:true}));
});

// compressing images & handle SVG files
gulp.task('images', function() {
    gulp.src(['app/img/**'])
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }));
});

///////////////
// DEPLOY: Compile all SCSS files to CSS and copy to ./build/css
gulp.task('sass-deploy', function() {
  return gulp.src('app/sass/*.scss')
       .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            gutil.beep();
            this.emit('end');
        }))
       .pipe(sass({
          precision: 10
        }))
       .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }))
       .pipe(csso())
       .pipe(gulp.dest('build/css'));
});

// DEPLOY: compressing images & handle SVG files
gulp.task('images-deploy', function() {
    gulp.src(['app/img/**/*'])
        .pipe(gulp.dest('build/img'));
});

// DEPLOY: Place all CSS inline and copy html files to build
gulp.task('inline', ['sass-deploy'], function() {
  return gulp.src(['./app/*.html'])
       .pipe(premailer())
       .pipe(gulp.dest('./build'));
});

// DEPLOY task
gulp.task('deploy', ['sass-deploy', 'images-deploy', 'inline']);



/////////////////
// Browser-sync
gulp.task('browser-sync', function () {
   var files = [
      './**/*.html',
      './app/**/*.css'
   ];
   
   browserSync.init(files, {
      server: {
        baseDir: "./app/"
      }
   });
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist']));

// Watch all changed files and perform its respective action
gulp.task('watch', function() {
  gulp.watch('./app/sass/*.scss', ['sass']);
  gulp.watch('img/**', ['images']);
});

////////////////////
// Default Gulp task
gulp.task('default', ['sass', 'watch', 'browser-sync']);