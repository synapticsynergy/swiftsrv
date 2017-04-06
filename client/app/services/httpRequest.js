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
            location: datum.location,
            distance: datum.distance
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

    var setCoordinates = function(coordinates){
      $window.localStorage.setItem('LocationFactoryCoordinates', JSON.stringify(coordinates));
      longitude = coordinates.longitude;
      latitude = coordinates.latitude;
    };

    return {
      setCoordinates: setCoordinates
      // findDistance: findDistance
    };
  });
