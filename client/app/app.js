angular.module("sqrtl", [
    "sqrtl.httpRequest",
    "sqrtl.auth",
    "sqrtl.form",
    "sqrtl.adventure",
    "sqrtl.uber",
    "ui.router",
    "ngRoute",
    "ui.bootstrap",
    "ngLodash",
    'stormpath',
    'stormpath.templates'
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider){
    //sets default state when the app is booted
    $urlRouterProvider
      .when('uber', '/uber')
      .otherwise('/');

    $locationProvider.html5Mode(true);
    //the form state that allows users to create their request
    $stateProvider
      .state('form', {
        url: '/form',
        templateUrl: 'app/form/form.html',
        controller: 'FormController',
        sp: {
          authenticate: true
        }
      }).state('adventure', {
        url: '/adventure',
        templateUrl: 'app/adventureLand/Adventure.html',
        controller: 'AdventureController',
        sp: {
          authenticate: true
        }
      })
      .state('uber',{
        url: '/uber',
        templateUrl: 'app/uber/uber.html',
        controller: 'UberController',
        sp: {
          authenticate: true
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/auth/login.html'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/auth/register.html'
      })
      .state('forgot', {
        url: '/forgot',
        templateUrl: 'app/auth/forgotPassword.html'
      });

  })
  .run(function($stormpath, $rootScope, $state){
    $stormpath.uiRouter({
      loginState: 'login',
      defaultPostLoginState: 'form'
    });

    $rootScope.$on('$sessionEnd', function(){
      $state.transitionTo('login');
    });
  })