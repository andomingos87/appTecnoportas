var gulp            = require('gulp'),
    htmlmin         = require('gulp-htmlmin'),
    autoprefixer    = require('gulp-autoprefixer'),
    uglify          = require('gulp-uglify'),
    sass            = require('gulp-sass')(require('sass'));

var paths = {
  html: {
    srcRoot: 'src/*.html',
    destRoot:'www',
    srcPage:'src/pages/*.html',
    destPage: 'www/pages'
  },
  style: {
    srcMain: 'src/scss/main/index.scss',
    destMain: 'www/css'
  },
  additionalCss: {
    src: 'assets/css/*',
    dest: 'www/css'
  },
  image:{
    imgSrc: 'assets/img/*',
    dest: 'www/img'
  },
  script:{
    pageSrc: 'src/js/pages/*.js',
    mainSrc: 'src/js/*.js',
    classSrc: 'src/js/classes/*.js',
    destPage: 'www/js/pages',
    destMain: 'www/js',
    destClass: 'www/js/classes'
  }
};
/* HTML  MINIFY */
function htmlMinRoot(){
  return gulp.src(paths.html.srcRoot)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(paths.html.destRoot))
}
function htmlMinPage(){
  return gulp.src(paths.html.srcPage)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(paths.html.destPage))
}

/* SCSS COMPILE AUTOPREFIXER MINIFY */
function styleGlobal() {
  return gulp.src(paths.style.srcMain, {
      sourcemaps: true
    })
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(gulp.dest(paths.style.destMain));
}

/* OTHER ASSETS */
function additionalCss(){
  return gulp.src(paths.additionalCss.src)
  .pipe(gulp.dest(paths.additionalCss.dest));
}
/* IMAGE */
function images(){
  return gulp.src(paths.image.imgSrc)
  .pipe(gulp.dest(paths.image.dest));
}
/* JS MINIFY */
function scriptPages() {
  return gulp.src(paths.script.pageSrc)
  .pipe(uglify())
  .pipe(gulp.dest(paths.script.destPage));
}
function scriptMain() {
  return gulp.src(paths.script.mainSrc)
  .pipe(uglify())
  .pipe(gulp.dest(paths.script.destMain));
}
function scriptClasses() {
  return gulp.src(paths.script.classSrc)
  .pipe(uglify())
  .pipe(gulp.dest(paths.script.destClass));
}

var build = gulp.parallel(styleGlobal, scriptMain, scriptPages, scriptClasses, htmlMinRoot, htmlMinPage, images, additionalCss);

gulp.task(build);

gulp.task('default', build);