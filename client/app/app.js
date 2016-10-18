angular.module("sqrtl", [
    "sqrtl.httpRequest",
    "sqrtl.form",
    "sqrtl.adventure",
    "sqrtl.uber",
    "ui.router",
    "ngRoute",
    "ui.bootstrap",
    "ngLodash",
    // "stormpath",
    // "stormpath.templates",
    // "uiGmapgoogle-maps",
    "ngTouch"
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider){
    //sets default state when the app is booted
    $urlRouterProvider
      .when('uber', '/uber')
      .otherwise('/form');

    $locationProvider.html5Mode(true);
    //the form state that allows users to create their request
    $stateProvider
      //functionality states
      .state('form', {
        url: '/form',
        templateUrl: 'app/form/form.html',
        controller: 'FormController',
      }).state('adventure', {
        url: '/adventure',
        templateUrl: 'app/adventureLand/Adventure.html',
        controller: 'AdventureController',
      })
      .state('uber',{
        url: '/uber',
        templateUrl: 'app/uber/uber.html',
        controller: 'UberController',
      });
      //stormpath authentication states
      // .state('login', {
      //   url: '/login',
      //   templateUrl: 'app/auth/login.html'
      // })
      // .state('register', {
      //   url: '/register',
      //   templateUrl: 'app/auth/register.html'
      // })
      // .state('forgot', {
      //   url: '/forgot',
      //   templateUrl: 'app/auth/forgotPassword.html'
      // });

  });
  // .run(function($stormpath, $rootScope, $state){
  //   //informs stormpath what state associates with login
  //   //and where to state to take afterwards
  //   // $stormpath.uiRouter({
  //   //   loginState: 'login',
  //   //   defaultPostLoginState: 'form'
  //   // });
  //   // //redirects users to the login state when a session expires
  //   // $rootScope.$on('$sessionEnd', function(){
  //   //   $state.transitionTo('login');
  //   // });
  // });