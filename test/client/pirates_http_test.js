require(__dirname + '/../../app/js/client');
require('angular-mocks');

describe('pirates controller', function() {
  var $httpBackend;
  var $ControllerConstructor;
  var $scope;

  beforeEach(angular.mock.module('piratesApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var controller = new $ControllerConstructor('PiratesController', {$scope: $scope});
    expect(typeof $scope).toBe('object');
    expect(typeof controller).toBe('object');
    expect(Array.isArray($scope.pirates)).toBe(true);
  });

  describe('REST requests', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $ControllerConstructor('PiratesController', {$scope: $scope});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a get request when getAll() is called', function() {
      $httpBackend.expectGET('/api/pirates').respond(200, [{pirateBody: 'test pirate'}]);
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.pirates[0].pirateBody).toBe('test pirate');
    });

    it('should be able to create a pirate', function() {
      $httpBackend.expectPOST('/api/pirates', {pirateBody: 'send test pirate', status: "pending"}).respond(200, {_id: 1, pirateBody: 'test pirate'});
      $scope.newPirate = {pirateBody: 'hello'};
      $scope.createPirate({pirateBody: 'send test pirate'});
      $httpBackend.flush();
      expect($scope.pirates[0].pirateBody).toBe('test pirate');
      expect($scope.newPirate).toBe(null);
    });
   //path goes set-expect, updatePirate actually goes, then backend flush checks
    it('should be able to update a pirate', function() {
      $scope.pirates[0] = {_id: 10, pirateBody: 'test pirate', status: "pending", editing: true};
      $httpBackend.expectPUT('/api/pirates/' + $scope.pirates[0]._id).respond(200);
      $scope.updatePirate($scope.pirates[0]);
      $httpBackend.flush();
      expect($scope.pirates[0].editing).toBe(false);
      expect($scope.pirates[0].status).toBe(undefined);
    });

    it('should be able to delete a pirate', function() {
      $scope.pirates[0] = {_id: 10, pirateBody: 'test pirate', status: "pending", editing: true};
      $httpBackend.expectDELETE('/api/pirates/' + $scope.pirates[0]._id).respond(200);
      $scope.removePirate($scope.pirates[0]);
      $httpBackend.flush();
      expect($scope.pirates[0]).toBe(undefined);
    });

    it('should be able to return status failed on failed PUT request', function() {
      $scope.pirates[0] = {_id: 10, pirateBody: 'test pirate', status: "pending", editing: true};
      $httpBackend.expectPUT('/api/pirates/' + $scope.pirates[0]._id).respond(404);
      $scope.updatePirate($scope.pirates[0]);
      $httpBackend.flush();
      expect($scope.pirates[0].status).toBe('failed');
    });

    it('should be able to return status failed on failed DELETE request', function() {
      $scope.pirates[0] = {_id: 10, pirateBody: 'test pirate', status: "pending", editing: true};
      $httpBackend.expectDELETE('/api/pirates/' + $scope.pirates[0]._id).respond(404);
      $scope.removePirate($scope.pirates[0]);
      $httpBackend.flush();
      expect($scope.pirates[0].status).toBe('failed');
    });
  });
});
