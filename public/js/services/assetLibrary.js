// AssetLibrary loads and contains all external assets (images, etc.)
angular.module('myApp').factory('AssetLibrary', function () {
  "use strict";
  
  var manifest = "data/brushesManifest.json";

  var loadCompleteCallback;

  // Create a LoadQueue instance
  var loadQueue = new createjs.LoadQueue();

  // Listener to the Complete event (when all images are loaded)
  loadQueue.addEventListener("complete", function() {
    // start the page after all assets have been loaded
    loadCompleteCallback();
  });

  loadQueue.addEventListener("error", function() {
    console.debug('error loading files');
    return false;
  });

  return {
    loadAllAssets: function (callback) {
      // Start loading assets
      loadCompleteCallback = callback;
      loadQueue.loadManifest({src: manifest, type: "manifest"});
    },
    getBrush: function (brushName) {
      return loadQueue.getResult(brushName);
    }
  };
});
