angular.module("sqrtl", [
    "sqrtl.httpRequest",
    "sqrtl.auth",
    "sqrtl.form",
    "sqrtl.adventure",
    "ui.router",
    "ngRoute"
  ])
  .config(function($stateProvider, $urlRouterProvider){
    //sets default state when the app is booted
    $urlRouterProvider
      .when('auth', '/auth')
      .otherwise('/form');
    //the form state that allows users to create their request
    $stateProvider
      .state('form', {
        url: '/form',
        templateUrl: 'app/form/form.html',
        controller: 'FormController'
      }).state('adventure', {
        url: '/adventure',
        templateUrl: 'app/adventureLand/Adventure.html',
        controller: 'AdventureController'
      })
      .state('auth',{
        url: '/auth',
        templateUrl: 'app/auth/auth.html',
        controller: 'AuthController'
      });

  })
  .factory('AttachTokens', function ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.sqrtl');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  // .run(function ($rootScope, $location, Auth) {
  //   $rootScope.$on('$routeChangeStart', function (evt, next, current) {
  //     if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
  //       $location.path('/auth');
  //     }
  //   });
  // });
