module.exports = function(app) {
  app.controller('PiratesController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.pirates = [];

    $scope.startUpdate = function(pirate) {
      pirate.oldValue = pirate.pirateBody;
      pirate.editing = true;
    };

    $scope.cancelUpdate = function(pirate) {
      pirate.pirateBody = pirate.oldValue;
      pirate.editing = false;
    };
    $scope.singShanty = function(pirate) {
      alert(pirate.favShanty);
    }

    $scope.getAll = function() {
      $http.get('/api/pirates')
        .then(function(res) {
          console.log(res.data);
          $scope.pirates = res.data;
        }, function(res) {
          console.log("FAILED", res);
        });
    };

    $scope.createPirate = function(pirate) {
      pirate.status = 'pending';
      $http.post('/api/pirates', pirate)
        .then(function(res) {
          $scope.pirates.push(res.data);
          $scope.newPirate = null;
          pirate.status = undefined;
        }, function(res) {
          console.log("FAILED", res);
        });
    };

    $scope.updatePirate = function(pirate) {
      pirate.status = 'pending';
      var timed = $timeout(function(){
        pirate.status = '';
        }, 2000);

      $http.put('/api/pirates/' + pirate._id, pirate)
        .then(function(res) {
          pirate.editing = false;
          pirate.status = undefined;
        },
        function(res) {
          $timeout.cancel(timed);
          pirate.status = 'failed';
          pirate.editing = false;
      });
    };

    $scope.removePirate = function(pirate) {
      pirate.status = 'pending';
      $http.delete('/api/pirates/' + pirate._id)
        .then(function() {
          $scope.pirates.splice($scope.pirates.indexOf(pirate), 1);
        }, function(res) {
          pirate.status = 'failed';
        });
    };
  }]);
};
