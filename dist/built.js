angular.module('sqrtl.adventure', [])

.controller('AdventureController', function($scope, $location, Adventures, $window) {

  $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];

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
    "sqrtl.form",
    "sqrtl.adventure",
    "sqrtl.uber",
    "ui.router",
    "ngRoute",
    "ui.bootstrap",
    "ngLodash",
    "stormpath",
    "stormpath.templates",
    "uiGmapgoogle-maps"
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

        })
        .then(function(){
          $state.go('adventure');
        });
    };
  });
angular.module('sqrtl.httpRequest', ["ngLodash"])
  .factory('Adventures', function($http, lodash){
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
        sortByReviewCount(data);
        data = randomizeTopFive(data);

        window.localStorage.setItem('data',JSON.stringify(data));
        data = JSON.parse(window.localStorage.getItem('data'));
        return data;
      })
      .catch(function(err){
        console.error(err);
      });
    };

    //sorts data by highest reviews first.
    var sortByReviewCount = function(data) {
      data.sort(function(a,b) {
        if (a.reviewCount < b.reviewCount) {
          return 1;
        }
        if (a.reviewCount > b.reviewCount) {
          return -1;
        }
        return 0;
      });
    };

    var randomizeTopFive = function(data) {
      var topFive = data.splice(0,5);
      var shuffledFive = lodash.shuffle(topFive);
      var newShuffledData = shuffledFive.concat(data);
      return newShuffledData;
    };

    var dataShift = function(){

      data = JSON.parse(window.localStorage.getItem('data'));
      data.shift();
      data = randomizeTopFive(data);
      window.localStorage.setItem('data',JSON.stringify(data));
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
angular.module("sqrtl.uber", ['ngLodash', 'uiGmapgoogle-maps'])
  .controller("UberController", function($scope, lodash, Adventures){

    $scope.destination = { latitude: '0', longitude: '0'};
    $scope.current = { latitude: '0', longitude: '0'};

    $scope.calculated = false;
    $scope.gotRide = false;
    $scope.gotPrices = false;
    $scope.geo = navigator.geolocation;
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680}, zoom: 10};


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
      $scope.gotPrices = true;
    });

   };

   $scope.getRide = function(productId, name){
    $scope.trip.productId = productId;
    $scope.trip.name = name;
    console.log('trip ', $scope.trip);

    Adventures.uberRide($scope.trip)
    .then(function(result){
      console.log('ride ', result);
      $scope.gotRide = true;
    });

   };

  $scope.geoFindMe(function(success){
    $scope.$apply(function(){
      $scope.current = {latitude: success.coords.latitude, longitude: success.coords.longitude};
      $scope.destination = {latitude: window.localStorage.getItem('latitude'), longitude: window.localStorage.getItem('longitude')};
      $scope.map.center.latitude = parseFloat($scope.current.latitude);
      $scope.map.center.longitude = parseFloat($scope.current.longitude);

      console.log($scope.current);
      console.log($scope.destination);
      console.log($scope.map.center);
      $scope.calculated = true;
    });
  });
});
