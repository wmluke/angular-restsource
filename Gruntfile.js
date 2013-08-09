'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        src: 'src',
        dist: 'dist',
        tmp: '.tmp'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        pkg: grunt.file.readJSON('bower.json'),
        lifecycle: {
            validate: [
                'jshint',
                'csslint'
            ],
            compile: [],
            test: [
                'connect:test',
                'karma:unit'
            ],
            package: [
                'concat:scripts',
                'uglify'
            ],
            'integration-test': [
                'express:dev',
                'karma:e2e'
            ],
            verify: [],
            install: [],
            deploy: []
        },
        watch: {
            assets: {
                files: [
                    '{<%= yeoman.src %>,<%= yeoman.app %>}/templates/{,*/}*.html',
                    '{<%= yeoman.src %>,<%= yeoman.app %>}/styles/{,*/}*.{scss,sass}',
                    '{<%= yeoman.src %>,<%= yeoman.app %>}/scripts/{,*/}*.js'
                ],
                tasks: ['phase-compile', 'phase-package']
            },
            livereload: {
                files: [
                    '<%= yeoman.dist %>/{,*/}*.html',
                    '<%= yeoman.dist %>/styles/{,*/}*.css',
                    '<%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, yeomanConfig.dist),
                            mountFolder(connect, yeomanConfig.app),
                            mountFolder(connect, yeomanConfig.tmp),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9090,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist),
                            mountFolder(connect, yeomanConfig.app),
                            mountFolder(connect, yeomanConfig.tmp),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        express: {
            options: {
                port: 9999,
                background: true,
                output: '.+'
            },
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            server: '<%= yeoman.tmp %>'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: [
                'Gruntfile.js',
                '<%= yeoman.src %>/scripts/{,*/}*.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: {
                src: [
                    '<%= yeoman.tmp %>/styles/**/*.css'
                ]
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            'unit-debug': {
                configFile: 'karma.conf.js',
                browsers: ['Chrome']
            },
            e2e: {
                configFile: 'karma-e2e.conf.js',
                singleRun: true
            },
            'e2e-debug': {
                configFile: 'karma-e2e.conf.js',
                browsers: ['Chrome'],
                runnerPort: 9100
            }
        },
        compass: {
            options: {
                cssDir: '<%= yeoman.tmp %>/styles',
                importPath: '<%= yeoman.app %>/components',
                relativeAssets: true
            },
            src: {
                options: {
                    sassDir: '<%= yeoman.src %>/styles',
                    imagesDir: '<%= yeoman.src %>/images',
                    javascriptsDir: '<%= yeoman.src %>/scripts',
                    fontsDir: '<%= yeoman.src %>/styles/fonts',
                    outputStyle: 'compact',
                    noLineComments: true
                }
            },
            app: {
                options: {
                    sassDir: '<%= yeoman.app %>/styles',
                    imagesDir: '<%= yeoman.app %>/images',
                    javascriptsDir: '<%= yeoman.app %>/scripts',
                    fontsDir: '<%= yeoman.app %>/styles/fonts',
                    debugInfo: true
                }
            }
        },
        concat: {
            options: {
                banner: ['/**! ',
                    ' * <%= pkg.name %> v<%= pkg.version %>',
                    ' * Copyright (c) 2013 <%= pkg.author %>',
                    ' */\n'].join('\n')
            },
            scripts: {
                src: [
                    '<%= yeoman.src %>/scripts/**/*.js'
                ],
                dest: '<%= yeoman.dist %>/scripts/<%= pkg.name %>.js'
            },
            styles: {
                src: [
                    '<%= yeoman.tmp %>/styles/**/*.css'
                ],
                dest: '<%= yeoman.dist %>/styles/<%= pkg.name %>.css'
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/<%= pkg.name %>.min.js': ['<%= concat.scripts.dest %>']
                }
            }
        }
    });

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.renameTask('regarde', 'watch');

    /**
     * Test debugging tasks
     */

    grunt.registerTask('test-start', ['karma:unit-debug:start']);
    grunt.registerTask('test-run', ['karma:unit-debug:run']);
    grunt.registerTask('e2e-start', ['connect:test', 'karma:e2e-debug:start']);
    grunt.registerTask('e2e-run', ['karma:e2e-debug:run']);

    /**
     * Standard Yeoman tasks
     */

    grunt.registerTask('build', [
        'clean',
        'install'
    ]);

    grunt.registerTask('server', [
        'clean',
        'package',
        'livereload-start',
        'connect:livereload',
        'express:dev',
        'open',
        'watch'
    ]);

    // alias for server
    grunt.registerTask('run', ['server']);

    grunt.registerTask('default', ['build']);
};
