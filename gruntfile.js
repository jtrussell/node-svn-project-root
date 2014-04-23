module.exports = function(grunt) {
  'use strict';

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: 'gruntfile.js',
      lib: 'lib/*.js',
      test: 'test/**/*.js'
    },

    simplemocha: {
      all: {
        src: 'test/*-test.js'
      }
    },

    watch: {
      lib: {
        files: 'lib/*.js',
        tasks: ['jshint:lib', 'test']
      },
      test: {
        files: 'test/**/*',
        tasks: ['jshint:test', 'test']
      },
      gruntfile: {
        files: 'gruntfile.js',
        tasks: ['jshint:gruntfile']
      }
    },

    bump: {
      options: {
        commitMessage: 'chore: Bump for release (v%VERSION%)',
        files: ['package.json'],
        commitFiles: ['-a'],
        push: false
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Register task(s)
  grunt.registerTask('test', ['simplemocha']);

  grunt.registerTask('default', [
    'jshint',
    'test'
  ]);

};
