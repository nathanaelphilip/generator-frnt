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
    this.choices = {};
  },

  prompting: function () {

    var done = this.async();

    this.log(yosay(
      'Welcome to ' + chalk.red('Frnt') + '!'
    ));

    var prompts = [{
      type: 'list',
      name: 'css',
      message: 'Which ' + chalk.red('CSS Processor') + ' would you like to use?',
      choices: ['sass'],
      store: true
    },
    {
      type: 'list',
      name: 'jsframework',
      message: 'Which JS framework do you want to use?',
      choices: ['vue','backbone','jquery'],
      store: true
    },
    {
      type: 'list',
      name: 'deploy',
      message: 'What are you going to use to deploy?',
      choices: ['dandelion','manually'],
      store: true
    }];

    this.prompt(prompts, function (props) {

      this.choices.css = props.css;
      this.choices.csshelpers = props.csshelpers;
      this.choices.jsframework = props.jsframework;
      this.choices.deploy = props.deploy;

      done();

    }.bind(this));

  },

  writing: {

    app: function () {

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {'processor': this.choices.css}
      );

      this.fs.copyTpl(
        this.templatePath('_gulp.js'),
        this.destinationPath('gulpfile.js'),
        {
            'processor': this.choices.css,
            'jsframework': this.choices.jsframework,
            'deploy': this.choices.deploy
        }
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

      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('../.gitignore')
      );

      if (this.choices.deploy == 'dandelion') {

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

      };

    },

    projectfiles: function () {

      this.mkdir('resources');
      this.mkdir('resources/assets');
      this.mkdir('resources/assets/js/');
      this.mkdir('resources/assets/images/');

      if (this.choices.css == 'sass') {
        this.mkdir('resources/assets/sass'); // TODO: make dynamic

        this.fs.copy(
          this.templatePath('scss/**/*'),
          this.destinationPath('resources/assets/sass')
        );

      }

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

      // copy over functions.php
      this.fs.copyTpl(
        this.templatePath('_functions.php'),
        this.destinationPath('functions.php')
      );

      // copy over js

      if (this.choices.jsframework == 'backbone') {

          this.fs.copyTpl(
            this.templatePath('js/_app.js'),
            this.destinationPath('resources/assets/js/app.js'),
            {'jsframework': this.choices.jsframework}
          );

          this.fs.copyTpl(
            this.templatePath('js/_main.js'),
            this.destinationPath('resources/assets/js/main.js'),
            {'jsframework': this.choices.jsframework}
          );

          this.fs.copy(
              this.templatePath('_bundle.config.js'),
              this.destinationPath('bundle.config.js')
          )

      }

      if (this.choices.jsframework == 'vue') {

      }

      if (this.choices.jsframework == 'jquery') {
          this.fs.copyTpl(
            this.templatePath('js/_app.js'),
            this.destinationPath('resources/assets/js/app.js'),
            {'jsframework': this.choices.jsframework}
          );
      }

    }

  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }

});
