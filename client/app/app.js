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
      .when('auth', '/auth')
      .when('uber', '/uber')
      .otherwise('/form');

    $locationProvider.html5Mode(true);
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
      })
      .state('uber',{
        url: '/uber',
        templateUrl: 'app/uber/uber.html',
        controller: 'UberController'
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