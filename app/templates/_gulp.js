var gulp = require("gulp");
var elixir = require("laravel-elixir");
var imagemin = require("laravel-elixir-imagemin");

elixir(function(mix){
    mix.sass("app.scss")
       .scripts(['app.js'])
       .imagemin()
       .browserSync({
           proxy: 'http://',
           files: [
               '**/*.php',
               'public/css/app.css',
               'public/js/all.js',
           ]
       });
});
