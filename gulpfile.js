const browserSync = require('./gulp/browser_sync');
exports.default = browserSync.watch;
exports.scss = browserSync.scss
