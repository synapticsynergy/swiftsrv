angular.module('sqrtl.adventure', ["ngTouch"])

.controller('AdventureController', function($scope, $location, Adventures, $window, LocationFactory) {
  //variable assignments
  /**************************/

  //sets the scope data from local storage
  $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];

  //gets distance to venue and formats it to kilometers,
  //it will not render to the page if the distance isnt availible
  var distance = LocationFactory.findDistance($scope.data.location.coordinate);
  distance? $scope.distance = distance + 'km' : $scope.distance = undefined;

  //assigns the coordinates and google maps url
  $scope.address = {
    long: $scope.data.location.coordinate.longitude,
    lat: $scope.data.location.coordinate.latitude,
    templateUrl: 'http://maps.google.com/maps?q=' + $scope.data.location.coordinate.latitude + ',' + $scope.data.location.coordinate.longitude
  };

  //$scope method assignments
  /**************************/

  //gets new data from localstorage when a new venue is requested
  $scope.getNew = function(){
    Adventures.dataShift();
    $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
    var distance = LocationFactory.findDistance($scope.data.location.coordinate);
    distance? $scope.distance = distance + 'km' : $scope.distance = undefined;
  };

  //requsts uber with you coordinates and then redirects your to ubers login
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

  //redirects you yelp page of associated venue
  $scope.moreDetails = function(){
    $window.location.href = $scope.data.url;
  };

  //redirects to google maps with that location preloaded
  $scope.googleRedirect = function(){
    $window.location.href = $scope.address.templateUrl;
  };

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
    "uiGmapgoogle-maps",
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
        //stormpath will check if the user is authenticated if there is a state change if they try to navigate to form, adventure, or uber.
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
      //stormpath authentication states
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
    //informs stormpath what state associates with login 
    //and where to state to take afterwards
    $stormpath.uiRouter({
      loginState: 'login',
      defaultPostLoginState: 'form'
    });
    //redirects users to the login state when a session expires
    $rootScope.$on('$sessionEnd', function(){
      $state.transitionTo('login');
    });
  });
angular.module("sqrtl.form", ['uiGmapgoogle-maps','ngTouch'])

  .controller("FormController", function($scope, $state, Adventures, LocationFactory, $touch){

    $touch.ngClickOverrideEnabled(true);

    $scope.geocoder = new google.maps.Geocoder();
    $scope.adventure = {};
    $scope.cll = undefined;
    $scope.cllYelp = undefined;
    $scope.calculating = false;
    $scope.location = undefined;

    $scope.getLocationAndCategory = function(location, category){
      Adventures.requestAdventures(location, category, $scope.cllYelp)
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

    $scope.findMe = function(){
      $scope.calculating = true;
      Adventures.geoFindMe(function(success){
        $scope.$apply(function(){
           $scope.cll = {latitude: success.coords.latitude, longitude: success.coords.longitude};
           $scope.cllYelp = success.coords.latitude + "," + success.coords.longitude;
           LocationFactory.setCoordinates($scope.cll);
           console.log("cll", $scope.cll);
           $scope.reverseGeocode();
           $scope.calculating = false;
        });
      });
    };

    $scope.reverseGeocode = function(){

      var latlng = new google.maps.LatLng($scope.cll.latitude, $scope.cll.longitude);
      $scope.geocoder.geocode({'latLng': latlng}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.$apply(function(){
            console.log("geocode results ", results[0].formatted_address);
            $scope.location = results[0].formatted_address;
          });
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      });
    };



  });
angular.module('sqrtl.httpRequest', ["ngLodash"])
  .factory('Adventures', function($http, lodash){
    //http requests
    /******************************/
    //GET Request to server side for venues base on local and category
    var requestAdventures = function(location, category, cll){

      var url = '/api/getYelp';

      return $http({
        method: 'POST',
        url: url,
        data: JSON.stringify({
          term: category,
          location: location,
          cll: cll
        })
      }).then(function(resp){
        //strips away unused yelp data
        data = resp.data.businesses.map(function(datum){
          return {
            url: datum.url,
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
        //orders by review count
        sortByReviewCount(data);
        //randomizes the first five
        data = randomizeTopFive(data);
        //adds array to localstorage fro permanence 
        window.localStorage.setItem('data',JSON.stringify(data));
        data = JSON.parse(window.localStorage.getItem('data'));

        return data;
      })
      .catch(function(err){
        console.error(err);
      });
    };
    //get request to backend for uber
    var getUber = function(){
      return $http({
        method: 'GET',
        url: '/api/getUber'
      }).then(function(resp){
        return resp.data;
      });
    };

    //returns price estimates by uber
    var uberPrice = function(data){
      return $http({
        method: 'POST',
        url: 'api/uberPrice',
        data: JSON.stringify(data)
      }).then(function(resp){
        return resp.data;
      });
    };

    //post request to serverside for uber
    var uberRide = function(data){
      return $http({
        method: 'POST',
        url: 'api/uberRide',
        data: JSON.stringify(data)
      }).then(function(resp){
        return resp.data;
      });
    };

    //helper functions
    /*****************************/
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

    //shuffles top five venues
    var randomizeTopFive = function(data) {
      var topFive = data.splice(0,5);
      var shuffledFive = lodash.shuffle(topFive);
      var newShuffledData = shuffledFive.concat(data);
      return newShuffledData;
    };

    //takes off first venue and restores the data
    var dataShift = function(){
      data = JSON.parse(window.localStorage.getItem('data'));
      data.shift();
      data = randomizeTopFive(data);
      window.localStorage.setItem('data',JSON.stringify(data));
    };


    //geolocates user
    var geoFindMe = function(callback){
      navigator.geolocation.getCurrentPosition(function(success){
        callback(success);
      });
    };

    return {
      requestAdventures: requestAdventures,
      dataShift: dataShift,
      getUber: getUber,
      uberPrice: uberPrice,
      uberRide: uberRide,
      geoFindMe: geoFindMe
    };



  })
  .factory("LocationFactory", function($window){
    var longitude, latitude;

    var setCoordinates = function(coordinates){
      $window.localStorage.setItem('LocationFactoryCoordinates', JSON.stringify(coordinates));
      longitude = coordinates.longitude;
      latitude = coordinates.latitude;
    };

    var findDistance = function(coordinates){
      //adds a method that converts numbers to radions
      Number.prototype.toRad = function(){
        return this*Math.PI/180;
      }
      //sets up the stwo points for calculation
      var lat1 = latitude,
          lon1 = longitude,
          lat2 = coordinates.latitude,
          lon2 = coordinates.longitude;
      //tests whether the data is good 
      if(typeof lat1 != 'number' || typeof lat2 != 'number' ||typeof lon1 != 'number' || typeof lon2 != 'number'){
        return undefined;
      }

      //distance between to points using longitude and latitude formula    
      var R = 6371e3,
          phi1 = lat1.toRad(),
          phi2 = lat2.toRad(),
          deltaPhi = (lat1 - lat2).toRad(),
          deltaLambda = (lon1 - lon2).toRad();

      var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2)+
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return Math.floor(R * c)/1000;
    };

    return {
      setCoordinates: setCoordinates,
      findDistance: findDistance
    };
  });

angular.module("sqrtl.uber", ['uiGmapgoogle-maps', 'ngTouch'])
  .controller("UberController", function($scope, Adventures){

    $scope.destination = { latitude: '0', longitude: '0'};
    $scope.current = { latitude: '0', longitude: '0'};
    $scope.calculated = false;
    $scope.gotRide = false;
    $scope.gotPrices = false;
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680}, zoom: 10};


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

  $scope.FindMe = function(callback){
    Adventures.geoFindMe(callback);
  };

  $scope.FindMe(function(success){
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
