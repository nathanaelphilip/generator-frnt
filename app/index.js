'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({

  paths: function(){
    this.mkdir('html');
    this.destinationRoot('html')
  },
  
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the cat\'s pajamas ' + chalk.red('Frnt') + ' generator!'
    ));

    var prompts = [{
      type: 'list',
      name: 'cssProcessor',
      message: 'Which ' + chalk.red('CSS Processor') + ' would you like to use?',
      choices: ['myth']
    }];

    this.prompt(prompts, function (props) {
      this.cssProcessor = props.cssProcessor;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
      this.fs.copy(
        this.templatePath('_gulp.js'),
        this.destinationPath('gulpfile.js')
      );
      this.fs.copy(
        this.templatePath('_csscomb.json'),
        this.destinationPath('.csscomb.json')
      );
      this.fs.copy(
        this.templatePath('_composer.json'),
        this.destinationPath('composer.json')
      );
      this.fs.copy(
        this.templatePath('_robots.txt'),
        this.destinationPath('../robots.txt')
      );
      this.fs.copyTpl(
        this.templatePath('_dandelion.yml'),
        this.destinationPath('../production.yml'),
        {'robots': false}
      );
      this.fs.copyTpl(
        this.templatePath('_dandelion.yml'),
        this.destinationPath('../staging.yml'),
        {'robots': true}
      );
    },

    projectfiles: function () {

      this.mkdir('assets');
      this.mkdir('assets/css');
      this.mkdir('assets/images');
      this.mkdir('assets/js');
      this.mkdir('assets/js/vendor');

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      // copy over index.php
      this.fs.copyTpl(
        this.templatePath('_index.php'),
        this.destinationPath('index.php'),
        {'title' : 'frnt'}
      );
      // copy over css
      this.fs.copy(
        this.templatePath('css/_reset.css'),
        this.destinationPath('assets/css/reset.css')
      );
      this.fs.copy(
        this.templatePath('css/_myth.css'),
        this.destinationPath('assets/css/myth.css')
      );
      // copy over js
      this.fs.copy(
        this.templatePath('js/app.js'),
        this.destinationPath('assets/js/app.js')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
