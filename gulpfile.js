var gulp = require('gulp');
var webpack = require('webpack-stream');
var mocha = require('gulp-mocha');
var Karma = require('karma').Server;

gulp.task('webpack:dev', function() {
  return gulp.src('./app/js/client.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('webpack:test', function() {
  return gulp.src('./test/client/client.js')
    .pipe(webpack({
      output: {
        filename: "test_bundle.js"
      }
    })).pipe(gulp.dest('test/client'));
})

gulp.task('staticfiles:dev', function() {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('build/'))
});

gulp.task('servertests', function() {
  return gulp.src('test/api_test/**/*.js', {read: false})
  .pipe(mocha({reporter: 'nyan'}))
        .once('error', function (err) {
          console.log(err);
            process.exit();
        })
        .once('end', function () {
          //this context is an instance of gulp, has so many props
          if(this.seq.length === 1 && this.seq[0] === 'servertests')
            process.exit();
          //bind this kinda works
        }.bind(this));
});

//like a dependency, karmatests runs first
gulp.task('karmatests', ['webpack:test'], function(done) {
  new Karma({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('build:dev', ['staticfiles:dev', 'webpack:dev']);
gulp.task('default', ['build:dev']);
