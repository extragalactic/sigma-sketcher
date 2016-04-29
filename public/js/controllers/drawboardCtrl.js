// ----------------------------------------------------
//  Drawboard Controller
// ----------------------------------------------------

// Drawboard Controller
angular.module('myApp').controller('DrawboardController', ['$scope', '$http', 'socket', 'appVars', 'AssetLibrary', function ($scope, $http, socket, appVars, AssetLibrary) {
  "use strict";

  $scope.themeType = appVars.config.themeType;
  $scope.brushType = "metabrushLines";

  // get the canvas object and the drawing context object
  var canvas = document.getElementById('drawCanvas');
  var ctx = canvas.getContext('2d');
  var stage = new createjs.Stage("drawCanvas");
  var stageBackground = new createjs.Shape();
  stage.addChild(stageBackground);

  var selectedColour = "#7bd148";
  var brushType = "metabrushLines";
  var brushIndex = 0;


  var mouse = {
     click: false,
     move: false,
     pos: {x:0, y:0},
     pos_prev: false
  };

  $scope.initCanvas = function() {
    canvas.width = 800;
    canvas.height = 600;

    var width   = window.innerWidth;
    var height  = window.innerHeight;

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

    drawBackground();

    // get current drawings from server
    socket.emit("requestDrawHistory");
  };

  function drawBackground() {
    stageBackground.x = 0;
    stageBackground.y = 0;
    var themeBackingColour = appVars.themes[$scope.themeType].backgroundColour;
    stageBackground.graphics.beginFill(themeBackingColour)
      .drawRect(0,0,canvas.width,canvas.height)
      .endFill();
    stage.update();
  }

  function getMousePos(canvasObj, evt) {
    var rect = canvasObj.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  // listen for global messages
  $scope.$on('newSelectedColour', function (event, newColour) {
    selectedColour = newColour;
  });

  // remove socket listeners when leaving page (called automatically)
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
    var width   = canvas.width;
    var height  = canvas.height;
    var lineData = data.line;
    var colourData = data.colour;
    var line = new createjs.Shape();

    // (note: brush types will be moved into modules or a service)

    if(data.brush==="metabrushLines") {
      line.graphics.setStrokeStyle(3);
      line.graphics.beginStroke(colourData);
      line.graphics.moveTo(lineData[0].x * width, lineData[0].y * height);
      line.graphics.lineTo(lineData[1].x * width, lineData[1].y * height);
      line.graphics.endStroke();
      stage.addChild(line);
    } else {

      if(data.brush==="metabrushGalactic") {
        if(brushIndex > 3) brushIndex = 0;
        brushIndex++;
      } else if (data.brush==="metabrushGeo") {
        if(brushIndex < 4) brushIndex = 4;
        if(brushIndex > 7) brushIndex = 4;
        brushIndex++;
      }
      var brushName = 'brush' + brushIndex;
      console.debug(brushName);
      var brushStamp = new createjs.Bitmap(AssetLibrary.getBrush(brushName));

      brushStamp.set({
        x: lineData[1].x * width,
        y: lineData[1].y * height,
        scaleX: 0.4,
        scaleY: 0.4,
        regX: brushStamp.getBounds().width/2,
        regY: brushStamp.getBounds().height/2
      });

      stage.addChild(brushStamp);

    }

    stage.update();
  });

  socket.on("refreshPage", function () {
    console.log('refreshing page');
    stage.removeAllChildren();
    stage.addChild(stageBackground);
    stage.update();
  });

  socket.on("messageOSC", function (message) {
    console.log('OSC message received by client: ' + message);
  });


  // not being used...
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
  // This runs every 50ms or so...
  //
  function mainLoop () {
     if (mouse.click && mouse.move && mouse.pos_prev) {
        var linePoints = [ mouse.pos, mouse.pos_prev ];
        socket.emit('drawElement', { line: linePoints, colour: selectedColour, brush: $scope.brushType });
        mouse.move = false;
     }
     mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
     setTimeout(mainLoop, 40);
  }

  // ---------------------------------------------------
  // listen for messages from view

  // send message to server to clear the drawing canvas
  $scope.refreshPage = function () {
    socket.emit('refreshPage');
  };

  $scope.changeThemeType = function () {
    appVars.config.themeType = $scope.themeType;
    drawBackground();
  };

  $scope.changeBrushType = function () {
    console.debug($scope.brushType);
    appVars.config.brushType = $scope.brushType;
  };

  // *********** begins here ***********
  AssetLibrary.loadAllAssets(function() {
    // start the page after all assets have been loaded
    // ... hmm, at the moment it is doing an unnecessary reload when you
    // flip between pages ...
    $scope.initCanvas();
    mainLoop();
  });

}]);
