angular.module('community').controller('QRController',
  ['$scope', '$location', 'AuthService', '$rootScope', '$timeout', '$window', '$routeParams', '$http', '$filter',
  function ($scope, $location, AuthService, $rootScope, $timeout, $window, $routeParams, $http, $filter) {
    $scope.loadingDiv = false;
    $scope.string = 'XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAe';
    $scope.start = function() {
        $scope.cameraRequested = true;
    }
    
    $scope.processURLfromQR = function (url) {
      $scope.url = url;
      $scope.cameraRequested = false;
    }
    
}]);