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
      'Welcome to the cat\'s pajamas ' + chalk.red('Frnt') + ' generator!'
    ));

    var prompts = [{
      type: 'list',
      name: 'css',
      message: 'Which ' + chalk.red('CSS Processor') + ' would you like to use?',
      choices: ['myth','sass'],
      store: true
    },
    {
      type: 'checkbox',
      name: 'csshelpers',
      message: 'Which CSS helpers would you like?',
      choices: [
        {
          name: 'Helpers',
          checked: true
        },
        {
          name: 'Reset',
          checked: true
        },
        {
          name: 'Normalize',
          checked: true
        }
      ],
      store: true
    },{
      type: 'list',
      name: 'deploy',
      message: 'What are you going to use to deploy?',
      choices: ['dandelion','manually'],
      store: true
    }];

    this.prompt(prompts, function (props) {
      
      this.choices.css = props.css;
      this.choices.csshelpers = props.csshelpers;
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
      
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
      
      this.fs.copyTpl(
        this.templatePath('_gulp.js'),
        this.destinationPath('gulpfile.js'),
        {'processor': this.choices.css}
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

      this.mkdir('src');
      this.mkdir('src/css');
      this.mkdir('src/images');
      this.mkdir('src/js/');
      this.mkdir('src/js/vendor');

      this.mkdir('assets');
      this.mkdir('assets/css');
      this.mkdir('assets/images');
      this.mkdir('assets/js');

      if (this.choices.css == 'sass') {
        this.mkdir('assets/css/global');
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
      
      // merge css helpers into a helper.css file
      var helpers = '';

      for (var i = this.choices.csshelpers.length - 1; i >= 0; i--) {

        helpers += this.fs.read(this.templatePath('css/helpers/_'+this.choices.csshelpers[i].toLowerCase()+'.css'));

      };

      this.fs.write(this.destinationPath('assets/src/helpers.css'),helpers);

      if (this.choices.css == 'myth') {
        
        this.fs.copy(
          this.templatePath('css/_myth.css'),
          this.destinationPath('src/css/myth.css')
        );

      };

      if (this.choices.css == 'sass') {
        
        this.fs.copy(
          this.templatePath('css/_main.scss'),
          this.destinationPath('src/css/main.scss')
        );

        this.fs.write('assets/src/global/_variable.scss','');
        this.fs.write('assets/src/global/_fonts.scss','');

      };

      
      // copy over js
      this.fs.copy(
        this.templatePath('js/app.js'),
        this.destinationPath('src/js/app.js')
      );

    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
  
});
