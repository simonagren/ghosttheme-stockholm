// Gulpfile.js running on stratumui,
// a css framework available on npmjs.com
'use strict';

var gulp = require('gulp'),
  less = require('gulp-less'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  handlebars = require('gulp-handlebars'),
  declare = require('gulp-declare'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  precss = require('precss'),
  babel = require('gulp-babel'),
  resolveDependencies = require('gulp-resolve-dependencies');


var paths = {
  styles: {
    src: 'src/less/*.less',
    dest: 'assets/css'
  },
  scripts: {
    src: 'src/js/*.js',
    dest: 'assets/js'
  },
  html: {
    src: 'views/*.hbs',
    dest: 'assets/'
  }
};

function styles() {
  return gulp
    .src(paths.styles.src, {
      sourcemaps: true
    })
    .pipe(less())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(cleanCSS({
      debug: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(sourcemaps.init())
    .pipe(postcss([require('precss'), require('autoprefixer')]))
    .pipe(sourcemaps.write('.'));
}

function scripts() {
  return gulp
    .src(paths.scripts.src, {
      sourcemaps: true
    })
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(resolveDependencies({
            pattern: /\* @requires [\s-]*(.*\.js)/g
        }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function templates() {
  gulp.src('views/*.hbs')
    .pipe(handlebars())
    //.pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('assets/js/'));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

var build = gulp.parallel(styles, scripts, templates, watch);

gulp.task(build);
gulp.task('default', build);
