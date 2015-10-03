var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var livereload = require('gulp-livereload');

<%  var stylesheet = 'myth.css'; if (processor == 'sass') { stylesheet = 'main.scss'; } %>

var ftp = {
  staging: {
    'username': 'your ftp username',
    'password': 'your ftp password',
    'host': 'ftp host path', // set ftp hostname. eg. 'ftp.example.com/htdocs'
    'root': './public_html' // set local syncroot path. eg. './', './public_html' etc
  },
  production: {
    'username': 'your ftp username',
    'password': 'your ftp password',
    'host': 'ftp host path', // set ftp hostname. eg. 'ftp.example.com/htdocs'
    'root': './public_html' // set local syncroot path. eg. './', './public_html' etc
  }
}

var paths = {
  css: {
  	src: ['src/css/<%= stylesheet %>'],
  	dest: 'assets/css/'
  },
  javascript: {
  	src: ['src/js/app.js'],
  	dest: 'assets/js/'
  },
  svg: {
    src: ['src/svg/*.svg'],
    dest: 'assets/svg/'
  },
  img: {
    src: ['src/images/*{.jpg,.png,.gif}'],
    dest: 'assets/images/'
  }
};

gulp.task('copy', function(){

	gulp.src('bower_components/components-modernizr/modernizr.js').pipe(gulp.dest('assets/js/vendor'));
	gulp.src('bower_components/html5shiv/dist/html5shiv.js').pipe(gulp.dest('assets/js/vendor'));
	gulp.src('bower_components/jquery/dist/jquery.js').pipe(gulp.dest('assets/js/vendor'));

});

gulp.task('js', function() {

  return gulp.src(paths.javascript.src)
        .pipe($.uglify())
        .pipe($.concat("app.min.js"))
        .pipe(gulp.dest(paths.javascript.dest))
        .pipe(livereload());

});

gulp.task('img', function() {

  return gulp.src(paths.img.src)
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(paths.img.dest));

});

gulp.task('svg', function() {

  return gulp.src(paths.svg.src)
    .pipe($.imagemin({
      svgoPlugins: [
        {removeUselessStrokeAndFill: false},
        {removeViewBox: true},
        {cleanupIDs: false}
      ],
    }))
    .pipe(gulp.dest(paths.svg.dest));

});

gulp.task('css', function() {

  return gulp.src(paths.css.src)
        .pipe($.plumber())
        <% if(processor == 'myth') { %>
          .pipe($.myth())
        <% } %>
        <% if(processor == 'sass') { %>
          .pipe($.sass())
          .pipe($.autoprefixer())
        <% } %>
        .pipe($.rename('style.css'))
        .pipe($.csscomb())
        .pipe(gulp.dest(paths.css.dest))
        .pipe(livereload());

});

// git ftp init -s staging | git ftp push -s staging
// git ftp init -s production | git ftp push -s production

gulp.task('ftp-setup', function(){

    $.shell.task('git config ftp-ftp.staging.user ' + ftp.staging.username );
    $.shell.task('git config ftp-ftp.staging.url ' + ftp.staging.host );
    $.shell.task('git config ftp-ftp.staging.password ' + ftp.staging.password );
    $.shell.task('git config ftp-ftp.staging.syncroot ' + ftp.staging.root );

    $.shell.task('git config ftp-ftp.production.user ' + ftp.production.username );
    $.shell.task('git config ftp-ftp.production.url ' + ftp.production.host );
    $.shell.task('git config ftp-ftp.production.password ' + ftp.production.password );
    $.shell.task('git config ftp-ftp.production.syncroot ' + ftp.production.root );

});

gulp.task('watch', function() {

  var server = $.livereload;
  server.listen();

  gulp.watch(paths.svg.src,['svg']); //
  gulp.watch(paths.img.src,['img']); //
	gulp.watch(paths.css.src, ['css']); // watch for changes to css and run the css task
	gulp.watch(paths.javascript.src, ['js']); // watch for changes to js and run the js task
	gulp.watch(['**.php']).on('change',function(file){
    livereload.changed(file.path);
  });

});

gulp.task('default', ['copy','css','js','watch','svg','img']);
