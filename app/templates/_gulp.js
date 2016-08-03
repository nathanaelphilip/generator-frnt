var gulp = require("gulp");
var elixir = require("laravel-elixir");
var imagemin = require("laravel-elixir-imagemin");

elixir.config.css.autoprefix.options = {
    browsers: [ '> 1%', 'last 2 versions', 'ios_saf >= 8', 'Safari >= 8' ]
}

elixir(function(mix){
    mix.sass("app.scss")
       .scripts(['app.js'])
       .imagemin({
           svgoPlugins: [
            {cleanupIDs: false}
          ]
       })
       .browserSync({
           proxy: 'http://',
           files: [
               '**/*.php',
               'public/css/app.css',
               'public/js/all.js',
           ]
       });
});
