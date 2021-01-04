
var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;
Page({
  onReady(){
  },
  onTouchStart(e){
    // console.log("touch start",e);
    touchstartCB&&touchstartCB(e)
  },
  onTouchCancel(e){
    // console.log("touch cancel",e)
    touchcancelCB&&touchcancelCB(e)
  },
  onTouchEnd(e){
    // console.log("touch end",e)
    touchendCB&&touchendCB(e)
  },
  onTouchMove(e){
    // console.log("touch move",e);
    touchmoveCB&&touchmoveCB(e)
  },
  canvasOnReady(){
    my.onTouchStart = function(cb){
      touchstartCB = cb;
    }
    my.onTouchCancel = function(cb){
      touchcancelCB = cb;
    }
    my.onTouchEnd = function(cb){
      touchendCB = cb;
    }
    my.onTouchMove = function(cb){
      touchmoveCB = cb;
    }

    require("layaengine/adapter.js");
    require("layaengine/libs/min/laya-c3c391bd89.tbmini.min.js");
    require("./index-0a756a2cc6.js");
  }
});
