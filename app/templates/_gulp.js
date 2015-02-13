var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var livereload = require('gulp-livereload');

<%  var stylesheet = 'myth.css'; if (processor == 'sass') { stylesheet = 'style.scss'; } %>

var paths = {
  css: {
  	src: ['assets/css/<%= stylesheet %>'],
  	dest: 'assets/css/'	
  },
  javascript: {
  	src: ['assets/js/app.js'],
  	dest: 'assets/js/'
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

gulp.task('watch', function() {
	
  var server = $.livereload;
  server.listen();

	gulp.watch(paths.css.src, ['css']); // watch for changes to css and run the css task
	gulp.watch(paths.javascript.src, ['js']); // watch for changes to js and run the js task
	gulp.watch(['**.php']).on('change',function(file){
    livereload.changed(file.path);
  });
  
});

gulp.task('default', ['copy','css','js','watch']);