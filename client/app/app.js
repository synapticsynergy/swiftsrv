Angular.model("sqrtl", [
    "sqrtl.httpRequest"
  ])
  .config(function($stateProvider, $urlRouteProvider){
    //sets default state when the app is booted
    $urlRouteProvider
      .otherwise('/form');
    //the form state that allows users to create their request
    $stateProvider
      .state('form', {
        url: '/form',
        templateUrl: 'views/form.html',
        controller: 'FormController'
      });
  });