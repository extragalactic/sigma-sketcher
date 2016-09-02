var socketio = require('socket.io-client');

angular.module('myApp').factory('socket', function ($rootScope) {
   var socketPath = "http://" + SKETCH_SERVER_IP + ":" + SKETCH_SERVER_PORT;
   console.log('creating socket connection: ' + socketPath);
   var socket = socketio.connect(socketPath);

   return {
     on: function (eventName, callback) {
         socket.on(eventName, function () {
             var args = arguments;
             $rootScope.$apply(function () {
                 callback.apply(socket, args);
             });
         });
     },
     emit: function (eventName, data) {
         socket.emit(eventName, data);
     },
     removeAllListeners: function () {
       socket.removeAllListeners();
     },
     id: socket.id
  };
});
