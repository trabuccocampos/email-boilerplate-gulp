var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    imagemin= require('gulp-imagemin'),
    filter = require('gulp-filter'),
    gutil       = require('gulp-util'),
    concat      = require('gulp-concat'),
    zopfli = require('gulp-zopfli'),
    uglify      = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps');

// sudo npm install --save-dev gulp
// sudo npm install --save-dev gulp-autoprefixer gulp-sass gulp-filter browser-sync gulp-imagemin gulp-util gulp-uglify gulp-concat gulp-zopfli gulp-minify-css gulp-rename gulp-sourcemaps gulp-plumber

// Compile all SCSS files to CSS and copy to ./css and ./build/css
gulp.task('sass', function() {
  return gulp.src('./scss/*.scss')
       .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            gutil.beep();
            this.emit('end');
        }))
       .pipe(sourcemaps.init())
       .pipe(sass())
       .pipe(sourcemaps.write())
       .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }))
       .pipe(filter('**.css'))
       .pipe(browserSync.reload({stream:true}))
       .pipe(gulp.dest('./css'));
});

// Production minified
gulp.task('production', function() {
  return gulp.src('./scss/*.scss')
       .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            gutil.beep();
            this.emit('end');
        }))
       .pipe(sass())
       .pipe(minifyCSS())
       .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }))
       .pipe(gulp.dest('./app/css'));
});


//compressing images & handle SVG files
gulp.task('images', function(tmp) {
    console.log(tmp);
    gulp.src(['img/**/*.jpg', 'img/**/*.png', 'img/**/*.svg'])
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }));
});

// Browser-sync
gulp.task('browser-sync', function () {
   var files = [
      './**/*.html',
      './css/**/*.css'
   ];

   browserSync.init(files, {
      server: {
        baseDir: "./"
      }
   });
});

// Watch all changed files and perform its respective action
gulp.task('watch', function() {
  gulp.watch('js/**', ['scripts']);
  gulp.watch('scss/**', ['sass']);
  gulp.watch('img/**', ['images']);
});

// Default Gulp task
gulp.task('default', ['sass', 'watch', 'browser-sync'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
});