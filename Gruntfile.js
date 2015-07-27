'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: ['app/static/js/*.js'],
            options: {
                jshintrc: '.jshintrc',
                force: false
            }
        },

        browserify: {
            dev: {
                options: {
                    debug: true
                },
                files: {
                    'app/static/main-build.js': ['app/static/js/main.js']
                }
            },
            build: {
                files: {
                    'app/static/main-build.js': ['app/static/js/main.js']
                }
            }
        },

        watch: {
            scripts: {
                files: ['app/static/js/*.js'],
                tasks: ['jshint', 'browserify:dev']
            }
        },

        uglify: {
            build: {
                src: 'app/static/main-build.js',
                dest: 'app/static/main-build.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'browserify:dev', 'watch']);
    grunt.registerTask('build', ['jshint', 'browserify:build', 'uglify:build']);
};
