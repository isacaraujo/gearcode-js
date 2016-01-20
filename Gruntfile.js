"use strict";

module.exports = function(grunt) {
  
  grunt.initConfig({
      
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      options: {
        alias: {
          jquery: './src/vendors/jquery.js',
          gsap: './src/vendors/gsap.js'
        }
      },
      dist: {
        files: {
          'dist/gearcode.js': ['src/**/*.js']
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/gearcode.min.js': [
            'dist/gearcode.js'
          ]
        }
      }
    },

    clean: {
      dist: ["dist/*.js"]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  
  // grunt.registerTask('default', ['clean', 'browserify', 'uglify']);
  grunt.registerTask('default', ['clean', 'browserify']);
};
