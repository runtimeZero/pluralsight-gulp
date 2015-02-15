var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var del = require('del');
var  config = require('./gulp.config.js')();
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

gulp.task('vet', function(){
  return gulp
  .src(config.alljs)
  .pipe($.if(args.verbose , $.print()))
  .pipe($.jscs())
  .pipe($.jshint())
  .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
  .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function(){
  $.util.log('Compiling less ---> CSS');

   return gulp
     .src(config.less)
     .pipe($.plumber())
     .pipe($.less())
     .pipe($.autoprefixer({browsers: ['last 2 versions', '> 5%']}))
     .pipe(gulp.dest(config.temp))

});

gulp.task('clean', function(done) {
   var  delconfig = [].concat(config.build, config.temp);
   $.util.log('cleaning: ' + $.util.colors.blue(delconfig));
   del(delconfig,done);
});

gulp.task('clean-styles', function(done) {
   var  files = config.temp + '**/*.css';
   clean(files, done);
});

gulp.task('clean-fonts', function(done) {
   clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function(done) {
   clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-code', function(done) {
  var files = [].concat(
    config.temp + '**/*.js',
    config.build + '**/*.html',
    config.build + '**/*.js'
  );
   clean(files, done);
});

gulp.task('templatecache', function() {
   return gulp
   .src(config.htmltemplates)
   .pipe($.minifyHtml({empty: true}))
   .pipe($.angularTemplatecache(
     config.templateCache.file,
     config.templateCache.options
   ))
   .pipe(gulp.dest(config.temp))
});

gulp.task('less-watcher', function() {
   gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', function() {
  $.util.log('Wireup the bower js and css and our app js into the html');
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream ;

  return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
  $.util.log('Wireup the app css into the html');
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream ;

  return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

gulp.task('serve-dev', ['inject'], function() {
  var isDev = true;
  var nodeOptions = {
    script : config.nodeServer,
    delayTime : 1,
    env : {
      'PORT' : port,
      'NODE_ENV' : isDev ? "dev" : "build"
    },
    watch: [config.server]
  };

   $.nodemon(nodeOptions)
     .on('restart', ['vet'], function(ev) {
       $.util.log('*** nodemon restart ***');
       $.util.log('files changed on restart :\n' + ev);
       setTimeout(function(){
         browserSync.notify('Reloading ...');
         browserSync.reload({stream: false});
       }, config.browserReloadDelay);
     })
     .on('start', function() {
       $.util.log('*** nodemon Started ***');
       startBrowserSync();
     })
     .on('crash', function() {
       $.util.log('*** nodemon crashed: script crashed for some reason ***');

     })
     .on('exit', function() {
       $.util.log('*** nodemon exited: Nodemon closed smoothly  ***');
     })
});

gulp.task('fonts', ['clean-fonts'], function(){
   $.util.log('Copying fonts');

   return gulp
     .src(config.fonts)
     .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function() {
   return gulp
   .src(config.images)
     .pipe($.imagemin({optimization: 4}))
     .pipe(gulp.dest(config.build + 'images'));
});
/////////////
function clean(path, done) {
  $.util.log('Cleaning ' + $.util.colors.blue(path));
  del(path, done);
}

function changeEvent(ev) {
   var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
   $.util.log('File' + event.path.replace(srcPattern, '') + '' + event.type);
}

function startBrowserSync() {
  if(args.noasync || browserSync.active) {
    return;
  }
  $.util.log('Starting browser sync on port ' + port);

  gulp.watch([config.less], ['styles'])
    .on('change', function(event) { changeEvent(event);})

  var options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: [config.client + '**/**', '!' + config.less, config.temp + '**/*.css' ],
    ghostModel: {
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 1000

  };

  browserSync(options);

}
