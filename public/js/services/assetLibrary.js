// AssetLibrary loads and contains all external assets (images, etc.)
angular.module('myApp').factory('AssetLibrary', function () {
  "use strict";

  var loadCompleteCallback = null;
  var manifest = "data/brushesManifest.json";
  console.debug('init asset library');

  // Create a LoadQueue instance
  var loadQueue = new createjs.LoadQueue();

  // Listener to the Complete event (when all files are loaded)
  loadQueue.addEventListener("complete", function() {
    // send completion message after all assets have been loaded
    loadCompleteCallback();
  });

  loadQueue.addEventListener("error", function() {
    console.warning('error loading files');
    return false;
  });

  return {
    loadAllAssets: function (callback) {
      loadCompleteCallback = callback;
      if(true) {
        // start loading assets
        loadQueue.loadManifest({src: manifest, type: "manifest"});
      } else {
        // assets already loaded so return
        loadCompleteCallback();
      }
    },
    getBrush: function (brushName) {
      return loadQueue.getResult(brushName);
    }
  };
});
