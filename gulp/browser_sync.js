const sass = require('gulp-sass');
const { src, dest, series, watch, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require("gulp-babel");

function browser_sync() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
}

function reloadPage(cb) {
    browserSync.reload();
    cb();
}
function timeout()  {
    return new Promise(resolve => {
        setTimeout(resolve, 100);
    });
}

function scss(cb) {
    src('./app/assets/styles/**/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./app/temp/styles/'));
    cb();
}

function css_stream(cb) {
    src('./app/temp/styles/styles.css').pipe(browserSync.stream());
    cb();
}

function scripts(cb) {
    src('./app/assets/scripts/script.js')
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(dest('./app/temp/scripts'))  
    cb();
}

function watch_files() {
    watch('./app/assets/styles/**/*.scss', series(scss,timeout, css_stream));
    watch('./app/index.html', reloadPage);
    watch('./app/assets/scripts/**/*.js', series(scripts, reloadPage));
}


exports.watch = parallel(watch_files, browser_sync);
exports.scss = scss;