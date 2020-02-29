const sass = require('gulp-sass');
const { src, dest, series, watch, parallel } = require('gulp');
const browserSync = require('browser-sync').create();

function browser_sync() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: true
    });
}

function reloadPage(cb) {
    browserSync.reload();
    cb();
}


function scss(cb) {
    src('./app/assets/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./app/temp/styles/'));
    cb();
}

function css_stream(cb) {
    src('./app/temp/styles/styles.css').pipe(browserSync.stream());
    cb();
}

function scripts(cb) {
    webpack(require('./webpack.config.js'), function (err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log(stats.toString());
    });
    cb();
}

function watch_files() {
    watch('./app/assets/styles/**/*.scss', series(scss, css_stream));
    watch('./app/index.html', reloadPage);
    watch('./app/assets/scripts/**/*.js', series(scripts, reloadPage));
}


exports.watch = parallel(watch_files, browser_sync);