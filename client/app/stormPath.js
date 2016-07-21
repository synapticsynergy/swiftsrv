angular.module('sqrtl.stormpath', [])
  .config(function($statProvider, urlRouterProvider, $locationProcider){
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
  })