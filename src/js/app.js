// ----------------------------------------------------
//  Main application script for SigmaSketcher
// ----------------------------------------------------

global.jQuery = $ = require('jquery');
require("angular-ui-bootstrap");

// create main Angular module
var myApp = angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngAnimate',
  'ngColorPicker'
])
// run initialization procedures
.run(['socket', function(socket) {
  socket.emit('login');
}])
// set application 'globals'
.value('appVars', {
  config: {
    themeType: 'dark',
    brushType: 'metabrushLines'
  },
  themes: {
    'light': {backgroundColour: '#fff'},
    'dark': {backgroundColour: '#000'}
  }
})
.config(['$routeProvider', function ($routeProvider) {
  // ---- init Angular route provider ----
  $routeProvider.
  when('/draw', {
    templateUrl: 'partials/drawboard.html',
    controller: 'DrawboardController'
  }).
  when('/gradients', {
    templateUrl: 'partials/gradients.html',
    controller: 'GradientsController'
  }).
  otherwise({
    redirectTo: '/draw'
  });
}]);


// Note: it appears that the ui-angular scripts are not fully working.
// I must manually add behavior to the buttons.

// initialize navbar button behavior
$(document).on('click', '.navbar-nav li', function (e) {
  $(this).addClass('active').siblings().removeClass('active');
});
$(document).on('click', '.navbar-brand', function (e) {
  $(this).addClass('active');
  $('.navbar-nav li:first').addClass('active').siblings().removeClass('active');
});

// init hamburger button
$(document).on('click', '#menuCollapseButton', function (e) {
  if ($('#navigationBar').hasClass('collapse')) {
    $('#navigationBar').removeClass('collapse');
  } else {
    $('#navigationBar').addClass('collapse');
  }
});
