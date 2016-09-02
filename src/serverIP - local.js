
var SKETCH_SERVER_IP = "192.168.1.73";
var SKETCH_SERVER_PORT = 3200;

(function() {

   var settings = {SKETCH_SERVER_IP : SKETCH_SERVER_IP, SKETCH_SERVER_PORT : SKETCH_SERVER_PORT}

   if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
      module.exports = settings;
   else {
      window.sigmaSketcherSettings = settings;
   }
})();
