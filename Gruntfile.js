module.exports = function(grunt) {
  // load up all of the necessary grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-casperjs');
  grunt.loadNpmTasks('grunt-mocha');


  // grunt setup
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // create a task called clean, which
    // deletes all files in the listed folders
    clean: {
      dist: 'dist/*',
      results: 'results/*'
    },

    // what files should be linted
    jshint: {
      gruntfile: 'Gruntfile.js',
      client: 'client/app/**/*.js',
      server: 'server/**/*.js',
      options: {
        globals: {
          eqeqeq: true
        }
      }
    },

    // uglify the files
    uglify: {
      dist: {
        files: {
          'dist/built.min.js': 'dist/built.js'
        }
      }
    },

    // concat all the js files
    concat: {
      dist: {
        files: {
          // concat all the client files
          'dist/built.js': 'client/app/**/*.js'
        }
      }
    },

    // configure the server
    express: {
      dev: {
        options: {
          script: './index.js'
        }
      }
    },

    // configure karma
    karma: {
      options: {
        configFile: 'karma.conf.js',
        reporters: ['nyan', 'unicorn']
      },
      // Watch configuration
      watch: {
        background: true,
        reporters: ['nyan']
      },
      // Single-run configuration for development
      single: {
        singleRun: true,
      },
      // Single-run configuration for CI
      ci: {
        singleRun: true,
        coverageReporter: {
          type: 'lcov',
          dir: 'results/coverage/'
        }
      }
    },

    // create a watch task for tracking
    // any changes to the following files
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile'
      },
      client: {
        files: [ 'client/**' ],
        tasks: [ 'build', 'karma:watch:run']
      },
      server: {
        files: [ 'server/**' ],
        tasks: [ 'build', 'express:dev'],
        options: {
          spawn: false // Restart server
        }
      },
      unitTests: {
        files: [ 'test/*.js' ],
        tasks: [ 'karma:watch:run' ]
      }
    }
  });

  // Perform a build
  grunt.registerTask('build', [ 'jshint', 'clean', 'concat', 'uglify']);

  // Run client tests once
  grunt.registerTask('test', [ 'karma:single' ]);

  // Run all tests once
  grunt.registerTask('ci', [ 'karma:ci', 'express:dev']);

  // Start watching and run tests when files change
  grunt.registerTask('default', [ 'build', 'express:dev', 'karma:watch:start', 'watch' ]);
};
