const{ src, dest, watch, parallel, series } = require('gulp')

const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const clean = require('gulp-clean')
const imagemin = require('gulp-imagemin')

const paths = {
  images: {
    src: 'app/images/*',
    dest: 'dist/images'
  }
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/*.html'
], {base: 'app'})
.pipe(dest('dist'))
}

function cleanDist() {
  return src('dist')
  .pipe(clean())
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  })
}

function styles() {
  return src('app/scss/style.scss')
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version']}))
  .pipe(concat('style.min.css'))
  .pipe(scss({ outputStyle:'compressed'}))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}

function watching() {
  watch(['app/scss/style.scss'],styles)
  watch(['app/*.html']).on('change',browserSync.reload) 
}

function img() {
  return src(paths.images.src)
  .pipe(imagemin())
  .pipe(dest(paths.images.dest))
}

exports.styles = styles
exports.watching = watching
exports.browsersync = browsersync
exports.building = building
exports.img = img

exports.build = series(cleanDist, building)
exports.default = parallel(styles, img, browsersync, watching)
