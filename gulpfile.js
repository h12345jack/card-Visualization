var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var sass = require('gulp-sass');


gulp.task('default', function(options) {
  return watch("./src/assets/**",function(){
    return gulp.src("./src/assets/**")
      .pipe(gulp.dest('./public/assets'));
  })    
});


gulp.task('clean', function(){
  return gulp.src("../card-vis-gh-pages/static/**",{ read:false })
      .pipe(clean({force: true}));

})

gulp.task('copy_build',['clean'],function(){
    return gulp.src("./build/**")
            .pipe(gulp.dest('../card-vis-gh-pages'));
});

gulp.task('rename_bundle',['copy_build'] ,function(){
  
    return gulp.src("./build/static/js/*.js")
        .pipe(rename(function(path){
            path.dirname = ".";
            path.basename = 'bundle';
            path.extname = ".js";
            console.log(path)
          }))
        .pipe(gulp.dest('../card-vis-gh-pages/static/js'));
});

gulp.task('build_addonvis',['rename_bundle'],function(){
    return   gulp.src("../card-vis-gh-pages/assets/js/addonvis.js")
            .pipe(replace(/http:\/\/127\.0\.0\.1:3000/g, 'https://h12345jack.github.io/card-Visualization'))
            .pipe(gulp.dest("../card-vis-gh-pages/assets/js/"));

})
gulp.task('build',[ 'build_addonvis'], function(){

  return gulp.src("../card-vis-gh-pages/index.html")
    .pipe(replace(/http:\/\/127\.0\.0\.1:3000/g, 'https://h12345jack.github.io/card-Visualization'))
    .pipe(rename(function(path){
      console.log(path);
    }))
    .pipe(gulp.dest("../card-vis-gh-pages"))

})

gulp.task('cp-gh-pages', function(){
  return gulp.src('./gh-pages/**')
        .pipe(gulp.dest('../card-vis-gh-pages'));
})


gulp.task('sass', function () {
  return gulp.src('./public/assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/assets/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./public/bootstrap-sass/*.scss', ['sass']);
});