// Karma configuration

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // testing frameworks to use
    frameworks: ['mocha', 'chai', 'sinon'],

    // list of files to exclude
    exclude: [
      'karma.conf.js'
    ],


    // list of files / patterns to load in the browser. order matters!
    files: [
      // angular source
      'client/lib/angular/angular.js',
      'client/lib/ng-lodash/build/ng-lodash.js',
      'client/lib/angular-mocks/angular-mocks.js',
      'client/lib/angular-ui-router/release/angular-ui-router.js',
      'client/lib/angular-route/angular-route.js',
      'client/lib/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/lib/stormpath-sdk-angularjs/dist/stormpath-sdk-angularjs.min.js',
      'client/lib/stormpath-sdk-angularjs/dist/stormpath-sdk-angularjs.tpls.min.js',
      'client/lib/angular-simple-logger/dist/angular-simple-logger.min.js',
      'client/lib/angular-google-maps/dist/angular-google-maps.min.js',


      // our app code
      'client/app/**/*.js',

      // our spec files
      'test/*.js'
    ],

    // test results reporter to use
    reporters: ['nyan','unicorn'],


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

   // start these browsers. PhantomJS will load up in the background
    browsers: ['PhantomJS'],

    // if true, Karma exits after running the tests.
    singleRun: true,

    // any additional plugins needed for testing
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-nyan-reporter',
      'karma-unicorn-reporter',
      'karma-phantomjs-launcher'
    ]

  });
};
