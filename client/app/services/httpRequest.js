angular.module('sqrtl.httpRequest', ["ngLodash"])
  .factory('Adventures', function($http, lodash){
    //requests venues that meet location and category criteria
    //TODO: add user parameters and such
    // var data = [];

    var requestAdventures = function(location, category, cll){


      var url = '/api/getYelp';
      //actual url is '/api/getYelp'
      return $http({
        method: 'POST',
        url: url,
        data: JSON.stringify({
          term: category,
          location: location,
          cll: cll
        })
      }).then(function(resp){
        // data.push(resp);
        // resp = JSON.parse(resp);
        console.log(resp.data.total);
        console.log(resp.data);
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
      Number.prototype.toRad = function(){
        return this*Math.PI/180;
      }
      var lat1 = latitude,
          lon1 = longitude,
          lat2 = coordinates.latitude,
          lon2 = coordinates.longitude;
      if(typeof lat1 != 'number' || typeof lat2 != 'number' ||typeof lon1 != 'number' || typeof lon2 != 'number'){
        return undefined;
      }    
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
