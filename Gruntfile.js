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
                    'app/static/main-build.js': ['app/static/main.js']
                }
            }
        },

        watch: {
            scripts: {
                files: ['app/static/js/*.js'],
                tasks: ['jshint', 'browserify:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['jshint', 'browserify:dev', 'watch']);
};
