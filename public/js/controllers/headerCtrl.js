// ----------------------------------------------------
// HeaderController
// ----------------------------------------------------

angular.module('myApp').controller('HeaderController', ['$scope', '$http', function ($scope, $http) {

  // create functionality for nav buttons
  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  };
}]);
