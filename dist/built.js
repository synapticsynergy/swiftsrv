angular.module('sqrtl.adventure', [])

.controller('AdventureController', function($scope, $location, Adventures, $window) {
  // var businessName;
  // var distance;
  // var reviewCount;
  // var ratings;
  // var ratingsImage;
  // var businessImage;
  // var description;

  $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];

  console.log($scope.data);

  $scope.getNew = function(){
    Adventures.dataShift();
    $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
  };

  $scope.getUber = function(location){
    console.log("location coords ", location);
    window.localStorage.setItem('latitude', location.latitude.toString());
    window.localStorage.setItem('longitude', location.longitude.toString());
    Adventures.getUber()
    .then(function(response){
      console.log("redirect URL ", response);
      $window.location.href = response;
    });
  };

  $scope.address = {
    long: $scope.data.location.coordinate.longitude,
    lat: $scope.data.location.coordinate.latitude,
    templateUrl: 'http://maps.google.com/maps?q=' + $scope.data.location.coordinate.latitude + ',' + $scope.data.location.coordinate.longitude
  };

  $scope.googleRedirect = function(){
    console.log($scope.address.templateUrl);
    $window.location.href = $scope.address.templateUrl;
  };
  //http://maps.google.com/maps?q=24.197611,120.780512






});




angular.module("sqrtl", [
    "sqrtl.httpRequest",
    "sqrtl.auth",
    "sqrtl.form",
    "sqrtl.adventure",
    "sqrtl.uber",
    "ui.router",
    "ngRoute",
    "ui.bootstrap"
  ])
  .config(function($stateProvider, $urlRouterProvider){
    //sets default state when the app is booted
    $urlRouterProvider
      .when('auth', '/auth')
      .when('uber', '/uber')
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
      })
      .state('uber',{
        url: '/uber',
        templateUrl: 'app/uber/uber.html',
        controller: 'UberController'
      });

  });
// {"web":{"client_id":"675533001795-ogilvisa2ekn4ehkgvuh3qd19oovr2q3.apps.googleusercontent.com","project_id":"sqrtl-1377","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"d5RHTO-rBKek0MYrYayjGuxu"}}


angular.module("sqrtl.auth", [])
  .controller("AuthController", function($scope, Adventures, $window){
    $scope.login = function (){
      console.log("called in auth");
      Adventures.authGoogle()
        .then(function(response){
          console.log("redirect URL ", response);
          $window.location.href = response;
        });
    };
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
          $scope.data = window.localStorage.getItem('data')[0];
          // $scope.data = Adventures.dataShift();
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
    // var data = [];

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
        window.localStorage.setItem('data',JSON.stringify(data));
        data = JSON.parse(window.localStorage.getItem('data'));
        return data;
      })
      .catch(function(err){
        console.error(err);
      });
    };

    var dataShift = function(){
      data = JSON.parse(window.localStorage.getItem('data'));
      shiftedData = data.shift();
      window.localStorage.setItem('data',JSON.stringify(data));
      console.log(JSON.parse(window.localStorage.getItem('data')));
      return shiftedData;
    };

    var getUber = function(){
      return $http({
        method: 'GET',
        url: '/api/getUber'
      }).then(function(resp){
        return resp.data;
      });
    };

    var uberPrice = function(data){
      return $http({
        method: 'POST',
        url: 'api/uberPrice',
        data: JSON.stringify(data)
      }).then(function(resp){
        return resp.data;
      });
    };

    var uberRide = function(data){
      return $http({
        method: 'POST',
        url: 'api/uberRide',
        data: JSON.stringify(data)
      }).then(function(resp){
        return resp.data;
      });
    };


    var authGoogle = function(){
      console.log("called in http");
      return $http({
        method: 'GET',
        url: '/api/authGoogle'
      }).then(function(resp){
        console.log(resp);
        return resp.data;
      });
    };

    return {
      requestAdventures: requestAdventures,
      dataShift: dataShift,
      getUber: getUber,
      uberPrice: uberPrice,
      uberRide: uberRide,
      authGoogle: authGoogle,
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
angular.module("sqrtl.uber", [])
  .controller("UberController", function($scope, Adventures){

    var destination = { latitude: '0', longitude: '0'};
    var current = { latitude: '0', longitude: '0'};


    $scope.geo = navigator.geolocation;

    $scope.geoFindMe = function(callback){
      $scope.geo.getCurrentPosition(function(success){
        callback(success);
      });
    };


   $scope.getPrice = function(){
    $scope.trip = { start_lat: $scope.current.latitude,
                 start_long: $scope.current.longitude,
                 final_lat: $scope.destination.latitude,
                 final_long: $scope.destination.longitude};

    Adventures.uberPrice($scope.trip)
    .then(function(result){
      console.log('price ', result);
      $scope.priceArray = result.prices;
    });

   };

   $scope.getRide = function(productId){
    $scope.trip.productId = productId;
    console.log('trip ', $scope.trip);

    Adventures.uberRide($scope.trip)
    .then(function(result){
      console.log('ride ', result);
    });

   };

  $scope.geoFindMe(function(success){
    $scope.$apply(function(){
      $scope.current = {latitude: success.coords.latitude, longitude: success.coords.longitude};
      $scope.destination = {latitude: window.localStorage.getItem('latitude'), longitude: window.localStorage.getItem('longitude')};
      console.log($scope.current);
      console.log($scope.destination);
    });
  });
});
