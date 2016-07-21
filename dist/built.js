angular.module('sqrtl.adventure', [])

.controller('AdventureController', function($scope, $location, Adventures) {
  // var businessName;
  // var distance;
  // var reviewCount;
  // var ratings;
  // var ratingsImage;
  // var businessImage;
  // var description;

  $scope.data = Adventures.dataShift();

  var getNew = function(){
    $scope.data = Adventures.dataShift();
  };

  $scope.getUber = function(location){
    console.log("location coords ", location);
    Adventures.getUber()
    .then(function(response){
      console.log("redirect URL ", response);
      $location.path(response);
    });
  };




});




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

  });
// {"web":{"client_id":"675533001795-ogilvisa2ekn4ehkgvuh3qd19oovr2q3.apps.googleusercontent.com","project_id":"sqrtl-1377","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"d5RHTO-rBKek0MYrYayjGuxu"}}


angular.module("sqrtl.auth", [])
  .controller("AuthController", function($scope){

  });




angular.module("sqrtl.form", [])
  .controller("FormController", function($scope, $state, Adventures){
    $scope.adventure = {};
    $scope.getLocationAndCategory = function(location, category){
      Adventures.requestAdventures(location, category)
        .then(function(data) {
          console.log(data);
          return true;
        })
        .then(function(){
          $scope.data = Adventures.dataShift();
        })
        .then(function(){
          $state.go('adventure');
        });
    };
  });
angular.module('sqrtl.httpRequest', [])
  .factory('Adventures', function($http){
    //requests venues that meet location and category criteria
    //TODO: add user parameters and such
    var data = [];

    var requestAdventures = function(location, category){


      var url = '/api/getYelp';
      //actual url is '/api/getYelp'
      return $http({
        method: 'POST',
        url: url,
        data: JSON.stringify({
          term: category,
          location: location
        })
      }).then(function(resp){
        // data.push(resp);
        // resp = JSON.parse(resp);
        data = resp.data.businesses.map(function(datum){
          return {
            name: datum.name,
            image: datum.image_url.replace(/ms.jpg/i, 'o.jpg'),
            isClosed: datum.is_closed,
            rating: datum.rating,
            ratingImg: datum.rating_img_url,
            reviewCount: datum.review_count,
            snippet: datum.snippet,
            location: datum.location
          };
        });
        return data;
      })
      .catch(function(err){
        console.error(err);
      });
    };

    var dataShift = function(){
      return data.shift();
    };

    var getUber = function(){
      return $http({
        method: 'GET',
        url: '/api/getUber'
      }).then(function(resp){
        return resp.data;
      });
    };


    return {
      requestAdventures: requestAdventures,
      dataShift: dataShift,
      getUber: getUber
    };

  });
  // .factory('UserResponses', function($http){
  //   //tells the database if a user accepted suggestions
  //   var initialReaction = function(userName, restauranArray){
  //     return $http({
  //       method: 'POST',
  //       url: '/adventure',
  //       data: JSON
  //     }).then(functon(){
  //       //should do something.
  //     })
  //   }

  // });