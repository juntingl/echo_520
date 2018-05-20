var postcss = require('gulp-postcss');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var cssnext = require('postcss-cssnext');

gulp.task('css', function () {

    var plugins = [
        cssnext({browsers: ['last 1 version']}),
        autoprefixer(),
        cssnano()
    ];

    return gulp.src('./css/style.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dist/css'));
});
