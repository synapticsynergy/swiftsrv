angular.module("sqrtl", [
    // "sqrtl.httpRequest"
    "sqrtl.form",
    "ui.router",
    "ngRoute"
  ])
  .config(function($stateProvider, $urlRouterProvider){
    //sets default state when the app is booted
    $urlRouterProvider
      .otherwise('/form');
    //the form state that allows users to create their request
    $stateProvider
      .state('form', {
        url: '/form',
        templateUrl: 'app/form/form.html',
        controller: 'FormController'
      });
  });