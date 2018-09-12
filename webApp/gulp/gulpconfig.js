var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');

/**
 *  This will write config to app
 */

var configureSetup  = {
  createModule: false,
  environment: process.env.NODE_ENV || 'local',
  pretty: true,
};

gulp.task('config', function() {
  gulp.src('config/config.json')
      .pipe(gulpNgConfig('BlurAdmin', configureSetup))
      .pipe(gulp.dest('src/app'));
});
