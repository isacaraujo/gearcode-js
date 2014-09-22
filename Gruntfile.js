var exec = require('child_process').exec;
module.exports = function(grunt) {
    "use strict";
    
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),
        
        concat: {
            options: {
                separator: "\n\n"
            },
            core: {
                src: ['src/core/Helpers.extends.js', 'src/core/Class.js', 'src/core/Object.js', 'src/core/EventDispatcher.js'],
                dest: 'dist/core.js'
            },
            graph: {
                src: ['src/graph/*.js'],
                dest: 'dist/graph.js'
            },
            display: {
                src: ['src/display/DisplayObject.js', 'src/display/Button.js', 'src/display/ScrollView.js'],
                dest: 'dist/display.js'
            },
            screen: {
                src: ['src/screen/*.js'],
                dest: 'dist/screen.js'
            },
            components: {
                src: ['src/components/*.js'],
                dest: 'dist/components.js'
            },
            mvc: {
                src: ['src/mvc/loaders/*.js', 'src/mvc/*.js'],
                dest: 'dist/mvc.js'
            },
            gearcode: {
                src: ['dist/core.js', 'dist/graph.js', 'dist/display.js', 'dist/screen.js', 'dist/components.js', 'dist/mvc.js'],
                dest: 'dist/gearcode.js'
            }
        },
        
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                  'dist/gearcode.min.js': [
                      '<%= concat.gearcode.dest %>'
                  ]
                }
            }
        }
    });
  
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.task.registerTask('cleanup', 'Executa quando todas as tarefas anteriores são concluidas', function () {
        var options = grunt.config('concat');
        for (var key in options) {
            if (undefined !== options[key].dest && !/gearcode/.test(key)) {
                grunt.file.delete(options[key].dest, { force: true });
            }
        }
        grunt.log.writeln("All mescle files removed.");
    });
    
    grunt.registerTask('default', ['concat', 'uglify', 'cleanup']);
};
