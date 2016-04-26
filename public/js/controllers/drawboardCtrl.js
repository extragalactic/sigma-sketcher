// ----------------------------------------------------
//  ListController
// ----------------------------------------------------

global.jQuery = $ = require('jquery');

// ListController
angular.module('myApp').controller('DrawboardController', ['$scope', '$http', 'socket', 'appVars', function ($scope, $http, socket, appVars) {

  this.socket = socket;
  this.appVars = appVars;

  // get the canvas object and the drawing context object
  var canvas = document.getElementById('drawCanvas');
  var ctx = canvas.getContext('2d');
  var stage = new createjs.Stage("drawCanvas");

  var mouse = {
     click: false,
     move: false,
     pos: {x:0, y:0},
     pos_prev: false
  };

  $scope.initCanvas = function() {
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    canvas.width = 800;
    canvas.height = 600;


    var width   = window.innerWidth;
    var height  = window.innerHeight;

    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();


    stage.on("stagemousedown", function(event) {
        // A mouse press happened.
        // Listen for mouse move while the mouse is down:
        //console.log('mouse down');
        //event.addEventListener("stagemousemove", handleMove);
    });
    stage.on("stagemouseup", function(event) {
        // A mouse press happened.
        // Listen for mouse move while the mouse is down:
        //console.log('mouse up');
      //   event.addEventListener("stagemousemove", handleMove);
    });


    function handleMove(event) {
        //console.log('mouse move');
    }

    canvas.onmousedown = function(e){
        mouse.click = true;
     };
    canvas.onmouseup = function(e){
        mouse.click = false;
    };
    canvas.onmousemove = function(e) {
      var windowWidth = document.getElementById('drawCanvas').offsetWidth;
      var windowHeight = document.getElementById('drawCanvas').offsetHeight;

      mouse.pos.x = getMousePos(canvas, e).x / windowWidth;
      mouse.pos.y = getMousePos(canvas, e).y / windowHeight;
      mouse.move = true;
    };
  };

  function getMousePos(canvasObj, evt) {
      var rect = canvasObj.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
  }

  // remove socket listeners when leaving page
  $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
  });

  // ---------------------------------------------------
  // listen for OSC socket messages from server
  // note: these OSC sockets also need to be migrated to a factory/singleton
  socket.on('connect', function () {
    // sends to socket.io server the host/port of oscServer and oscClient
    socket.emit('config', {
      server: {
        port: 3333,
        host: SKETCH_SERVER_IP
      },
      client: {
        port: 3334,
        host: SKETCH_SERVER_IP
      }
    });
  });

  socket.on('drawElement', function (data) {
    //var width   = window.innerWidth;
    //var height  = window.innerHeight;
    var width   = canvas.width;
    var height  = canvas.height;
    var lineData = data.line;
    var line = new createjs.Shape();

    line.graphics.setStrokeStyle(3);
    line.graphics.beginStroke("#000");
    line.graphics.moveTo(lineData[0].x * width, lineData[0].y * height);
    line.graphics.lineTo(lineData[1].x * width, lineData[1].y * height);
    line.graphics.endStroke();
    stage.addChild(line);
    stage.update();

  });

  socket.on("refreshPage", function () {
    stage.removeAllChildren();
    stage.update();
  });

  socket.on("messageOSC", function (message) {
    console.log('OSC message received by client: ' + message);
  });


  $scope.resizeMe = function () {
    var canvas = document.getElementById('drawCanvas');
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(canvas.width + ', ' + canvas.height);
    //redraw();
  };

  // ---------------------------------------------------
  function mainLoop () {
     if (mouse.click && mouse.move && mouse.pos_prev) {
        var linePoints = [ mouse.pos, mouse.pos_prev ];
        socket.emit('drawElement', { line: linePoints });
        mouse.move = false;
     }
     mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
     setTimeout(mainLoop, 25);
  }

  // begin
  $scope.initCanvas();
  mainLoop();



  // ---------------------------------------------------
  // listen for messages from view

  // send message to server to clear the drawing canvas
  $scope.refreshPage = function () {
    socket.emit('refreshPage');
  };



}]);
