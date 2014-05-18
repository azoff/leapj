var gulp = require('gulp');
var exec = require('child_process').exec;

var paths = {
  scripts: ['./src/**/*.coffee']
};

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['build']);
});

gulp.task('build', function (cb) {
  exec('make build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('default', ['watch']);