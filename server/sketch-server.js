// ==========================================================
// Sigma-1 Sketcher Node.js server
// ==========================================================

(function() {
"use strict";

// define external modules
var express = require("express");
var http = require("http");
var app = express();
var settings = require("./../dist/serverIP");
var server = http.createServer(app).listen(settings.SKETCH_SERVER_PORT);
var io = require("socket.io")(server);
var fs = require("fs");
var osc = require('node-osc');

// init application vars
var userList = [];
var drawHistory = [];
var oscServer, oscClient;

// set root folder for Express web server
app.use(express.static("./../dist"));

// define handlers for all incoming messages
io.on("connection", function(socket) {

   // ----------------------------------------------------
   socket.on("config", function (obj) {

      if(oscServer===undefined || oscClient===undefined) {
         console.log('configure OSC socket');
         oscServer = new osc.Server(obj.server.port, obj.server.host);
         oscClient = new osc.Client(obj.client.host, obj.client.port);
         //  oscClient.send('/status', socket.sessionId + ' connected');

         oscServer.on('message', function(msg, rinfo) {
           var OSCmsg = msg[2][0]; // trim the data out of the message
           console.log('OSC server received message: ' + OSCmsg);
           io.emit("messageOSC", OSCmsg);
         });
      }
    });

    // ----------------------------------------------------
    socket.on("messageOSC", function(message) {
        console.log('sending OSC message to TouchDesigner: ' + message);
        oscClient.send(message);
    });

    // ----------------------------------------------------

    socket.on("login", function() {
      var userData = {};
      userData.socketID = socket.id;
      userList.push(userData);

      console.log('User Login, # users: ' + userList.length);

      //initNewClient(socket);

      //var loginMessage = userData.id + ' has logged in';
      //socket.broadcast.emit("message", loginMessage);
      //io.emit("numUsers", userList.length);
      //io.emit('userlist', userList);
    });

    socket.on('drawElement', function (data) {
      drawHistory.push(data);
      io.emit('drawElement', data);
    });

    socket.on('refreshPage', function () {
      drawHistory.length = 0;
      io.emit('refreshPage');
    });

    socket.on("requestDrawHistory", function() {
      for (var i in drawHistory) {
         socket.emit('drawElement', drawHistory[i] );
      }
    });

    // ----------------------------------------------------
    socket.on("getUserList", function() {
      console.log('# users: ' + userList.length);
      //socket.emit('userlist', userList) ;
    });

    // ----------------------------------------------------
    socket.on("disconnect", function() {
      // remove user from userList array
      for(var i=0, len = userList.length; i<len; ++i ) {
        var user = userList[i];

        if(user.socketID === socket.id){
          //io.emit('message', user.name + ' has logged out');
          userList.splice(i,1);
          console.log('user logged out...');
          console.log('# users: ' + userList.length);
          break;
        }
      }
      //io.emit("userlist", userList);
    });

    // initialization code for server
    socket.emit("message", "[connected to server]");

});

// ----------------------------------------------------
function initNewClient(socket) {
   for (var i in drawHistory) {
      socket.emit('drawElement', drawHistory[i] );
   }
}

// utility functions
/*
function getUserNameArray() {
  var userNameArray = [];
  userList.forEach(function(element, index, array) {
      userNameArray.push(userList[index].name);
  });
  return userNameArray;
}
*/

console.log("Starting Sigma Sketcher server on http://" + settings.SKETCH_SERVER_IP + ":" + settings.SKETCH_SERVER_PORT);

exports.mainApp = app;

}());
