// ----------------------------------------------------
//  GradientstController
// ----------------------------------------------------

global.jQuery = $ = require('jquery');

// GradientsController
angular.module('myApp').controller('GradientsController', ['$scope', '$http', 'socket', 'appVars', function ($scope, $http, socket, appVars) {
  "use strict";
  this.socket = socket;
  this.appVars = appVars;




}]);
