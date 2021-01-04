(function () {
  'use strict';

  var Tween = Laya.Tween;
  var Ease = Laya.Ease;
  var Handler = Laya.Handler;
  class GuideText extends Laya.Script {
      constructor() {
          super();
      }
      onEnable() {
          const guideText = this.owner;
          const tweenProps1 = { scaleX: 1, scaleY: 1 };
          const tweenProps2 = { scaleX: 0.8, scaleY: 0.8 };
          const duringTime = 350;
          function tweenLoop() {
              Tween.to(guideText, tweenProps1, duringTime, Ease.linearInOut, Handler.create(this, () => {
                  Tween.to(guideText, tweenProps2, duringTime);
              }), null, true);
          }
          Laya.timer.loop(700, this, tweenLoop);
      }
      onDisable() { }
  }

  var Tween$1 = Laya.Tween;
  var Ease$1 = Laya.Ease;
  var Handler$1 = Laya.Handler;
  class GuideBtn extends Laya.Script {
      constructor() {
          super();
      }
      onEnable() {
          const guideBtn = this.owner;
          guideBtn.x = 196 + 358 / 2;
          guideBtn.y = 1110 + 125 / 2;
          guideBtn.pivotX = 358 / 2;
          guideBtn.pivotY = 125 / 2;
          guideBtn.rotation = -5;
          function tweenLoop() {
              Tween$1.to(guideBtn, { rotation: 5 }, 300, Ease$1.linearNone, Handler$1.create(this, () => {
                  Tween$1.to(guideBtn, { rotation: -5 }, 300);
              }));
          }
          Laya.timer.loop(600, this, tweenLoop);
      }
      onDisable() { }
      onClick() {
          Laya.Scene.open("gameScene.scene", true);
      }
  }

  var Tween$2 = Laya.Tween;
  var Sprite = Laya.Sprite;
  var Event = Laya.Event;
  class GuideRule extends Laya.Script {
      constructor() {
          super();
      }
      onAwake() {
          const _mask = new Sprite();
          this._mask = _mask;
          _mask.loadImage("img/mask.png");
          _mask.pivot(375, 667);
          _mask.x = 375;
          _mask.y = 667;
          _mask.alpha = 0.7;
          _mask.zOrder = -1;
          _mask.scale(0, 0);
          _mask.name = "mask";
          const _close = new Sprite();
          _close.loadImage("img/close.png");
          _close.scale(0.5, 0.5);
          _close.x = 620;
          _close.y = 60;
          _close.on(Event.CLICK, this, this.maskClose);
          _mask.addChild(_close);
          this.owner.scene.addChild(_mask);
      }
      onClick() {
          Tween$2.to(this._mask, { scaleX: 1, scaleY: 1, zOrder: 1 }, 500);
      }
      maskClose() {
          Tween$2.to(this._mask, { scaleX: 0, scaleY: 0, zOrder: -1 }, 500);
      }
  }

  class MoonCake extends Laya.Sprite {
      constructor() {
          super();
          this.cakeType = Math.random() > 0.5 ? 0 : 1;
          this.loadImage(this.cakeType == 0
              ? "http://enbrands.oss-cn-shenzhen.aliyuncs.com/game/midAutumn/images/IMG_GAME_FIGURE_1.png"
              : "http://enbrands.oss-cn-shenzhen.aliyuncs.com/game/midAutumn/images/IMG_GAME_FIGURE_2.png");
          this.pivot(380 / 2, 407 / 2);
      }
  }

  var Tween$3 = Laya.Tween;
  var Sprite$1 = Laya.Sprite;
  var Ease$2 = Laya.Ease;
  var Handler$2 = Laya.Handler;
  var Event$1 = Laya.Event;
  var Label = Laya.Label;
  const MAX_SIZE = 6;
  const queue = new Array(MAX_SIZE);
  class Game extends Laya.Script {
      constructor() {
          super();
      }
      init() {
          let _mooncake;
          for (let i = 0; i < MAX_SIZE; i++) {
              _mooncake = new MoonCake();
              _mooncake.x = 375;
              _mooncake.y = 850 - i * 76;
              _mooncake.scale(1 - i * 0.1, 1 - i * 0.1);
              _mooncake.zOrder = 6 - i;
              queue[i] = _mooncake;
          }
          this.owner.addChildren(...queue);
      }
      onAwake() {
          this.init();
      }
      onEnable() {
          const THIS_SCENE = this.owner.scene;
          let currentMoonCake;
          function dragCake() {
              currentMoonCake = queue[0];
              currentMoonCake.x = Laya.stage.mouseX;
          }
          function removeCake() {
              currentMoonCake = queue[0];
              const callbackFn = Handler$2.create(this, () => {
                  Laya.stage.removeChild(currentMoonCake);
                  currentMoonCake.destroy(true);
                  queueUpdate();
              });
              if (Laya.stage.mouseX - 375 < 0) {
                  addScore("left");
                  Tween$3.to(currentMoonCake, { x: -190, alpha: 0 }, 200, Ease$2.linearNone, callbackFn);
              }
              else {
                  addScore("right");
                  Tween$3.to(currentMoonCake, { x: 940, alpha: 0 }, 200, Ease$2.linearNone, callbackFn);
              }
          }
          function addScore(direction) {
              const addScore = THIS_SCENE.getChildByName("add");
              const minusScore = THIS_SCENE.getChildByName("minus");
              const scoreText = THIS_SCENE.getChildByName("scoreText");
              addScore.y = 560;
              minusScore.y = 560;
              if ((currentMoonCake.cakeType == 0 && direction == "left") ||
                  (currentMoonCake.cakeType == 1 && direction == "right")) {
                  scoreText.text = parseInt(scoreText.text) + 1 + "";
                  Tween$3.to(addScore, { alpha: 1, y: 260 }, 200, Ease$2.linearNone, Handler$2.create(this, () => {
                      Tween$3.to(addScore, { alpha: 0 }, 200, Ease$2.linearNone);
                  }));
              }
              else {
                  scoreText.text = parseInt(scoreText.text) - 2 + "";
                  Tween$3.to(minusScore, { alpha: 1, y: 260 }, 200, Ease$2.linearNone, Handler$2.create(this, () => {
                      Tween$3.to(minusScore, { alpha: 0 }, 200, Ease$2.linearNone);
                  }));
              }
          }
          Laya.stage.on(Event$1.MOUSE_MOVE, this, dragCake);
          Laya.stage.on(Event$1.MOUSE_UP, this, removeCake);
          function queueUpdate() {
              if (queue.length > 0) {
                  queue.shift();
              }
              else {
                  return;
              }
              if (queue.length > 0) {
                  queue.forEach((item) => {
                      item.zOrder++;
                      let i = 6 - item.zOrder;
                      Tween$3.to(item, {
                          y: 850 - i * 76,
                          scaleX: 1 - i * 0.1,
                          scaleY: 1 - i * 0.1,
                      }, 200);
                  });
                  let _newCake = new MoonCake();
                  _newCake.x = 375;
                  _newCake.y = 470;
                  _newCake.scale(0, 0);
                  _newCake.zOrder = 1;
                  THIS_SCENE.addChildren(_newCake);
                  Tween$3.to(_newCake, { scaleX: 0.5, scaleY: 0.5 }, 200);
                  queue.push(_newCake);
              }
              else {
                  Laya.Scene.open("2.scene", true);
              }
          }
          const timer = THIS_SCENE.getChildByName("timer");
          let _count = 60;
          Laya.timer.loop(1000, this, () => {
              _count--;
              if (_count >= 10) {
                  timer.text = "00:" + _count;
              }
              else {
                  timer.text = "00:0" + _count;
              }
              if (_count == 0) {
                  openResult();
              }
          });
          function openResult() {
              Laya.stage.off(Event$1.MOUSE_MOVE, this, dragCake);
              Laya.stage.off(Event$1.MOUSE_UP, this, removeCake);
              const result = new Sprite$1();
              result.loadImage("img/mask.png");
              result.alpha = 0.7;
              result.x = 0;
              result.y = 0;
              result.zOrder = 999;
              const scoreLabel = new Label();
              scoreLabel.color = "#ffffff";
              scoreLabel.fontSize = 50;
              scoreLabel.align = "center";
              scoreLabel.text =
                  "最终得分：\n" + THIS_SCENE.getChildByName("scoreText").text;
              scoreLabel.pivot(scoreLabel.width / 2, scoreLabel.height / 2);
              scoreLabel.x = 375;
              scoreLabel.y = 444;
              result.addChild(scoreLabel);
              result.on(Event$1.CLICK, this, () => {
                  Laya.Scene.open("1.scene", true);
              });
              THIS_SCENE.addChild(result);
          }
      }
      onDisable() { }
  }

  var Tween$4 = Laya.Tween;
  var Ease$3 = Laya.Ease;
  var Handler$3 = Laya.Handler;
  var Event$2 = Laya.Event;
  const MAX_SIZE$1 = 6;
  const queue$1 = new Array(MAX_SIZE$1);
  class GameStart extends Laya.Script {
      constructor() {
          super();
      }
      init() {
          let _mooncake;
          for (let i = 0; i < MAX_SIZE$1; i++) {
              _mooncake = new MoonCake();
              _mooncake.x = 375;
              _mooncake.y = 850 - i * 76;
              _mooncake.scale(1 - i * 0.1, 1 - i * 0.1);
              _mooncake.zOrder = 6 - i;
              queue$1[i] = _mooncake;
          }
          this.owner.addChildren(...queue$1);
      }
      onAwake() {
          this.init();
          const tweenProps1 = { scaleX: 1.25, scaleY: 1.25 };
          const tweenProps2 = { scaleX: 1, scaleY: 1 };
          const _eat = this.owner.getChildByName("eat");
          const _go = this.owner.getChildByName("go");
          const duringTime = 1000;
          function tweenLoopRight() {
              Tween$4.to(_eat, tweenProps1, duringTime, Ease$3.linearInOut, Handler$3.create(this, () => {
                  Tween$4.to(_eat, tweenProps2, duringTime);
              }), null, true);
          }
          function tweenLoopLeft() {
              Tween$4.to(_go, tweenProps1, duringTime, Ease$3.linearInOut, Handler$3.create(this, () => {
                  Tween$4.to(_go, tweenProps2, duringTime);
              }), null, true);
          }
          Laya.timer.loop(2 * duringTime, this, tweenLoopRight);
          setTimeout(() => {
              Laya.timer.loop(2 * duringTime, this, tweenLoopLeft);
          }, 1000);
      }
      onEnable() {
          const hand = this.owner.scene.getChildByName("hand");
          const THIS_SCENE = this.owner.scene;
          function handMove() {
              const toRight = { alpha: 1, x: 871 };
              const toLeft = { alpha: 1, x: -123 };
              Tween$4.clearAll(hand);
              hand.x = 375;
              if (queue$1.length > 0) {
                  if (queue$1[0].cakeType == 0) {
                      Tween$4.to(hand, toLeft, 1000).repeat = 0;
                  }
                  else {
                      Tween$4.to(hand, toRight, 1000).repeat = 0;
                  }
              }
              else {
                  THIS_SCENE.removeChild(hand);
              }
          }
          handMove();
          let currentMoonCake;
          function dragCake() {
              currentMoonCake = queue$1[0];
              currentMoonCake.x = Laya.stage.mouseX;
          }
          function removeCake() {
              currentMoonCake = queue$1[0];
              const callbackFn = Handler$3.create(this, () => {
                  Laya.stage.removeChild(currentMoonCake);
                  queueUpdate();
              });
              if (currentMoonCake.x - 375 < 0) {
                  Tween$4.to(currentMoonCake, { x: -100, alpha: 0 }, 200, Ease$3.linearNone, callbackFn);
              }
              else {
                  Tween$4.to(currentMoonCake, { x: 850, alpha: 0 }, 200, Ease$3.linearNone, callbackFn);
              }
          }
          Laya.stage.on(Event$2.MOUSE_MOVE, this, dragCake);
          Laya.stage.on(Event$2.MOUSE_UP, this, removeCake);
          function queueUpdate() {
              if (queue$1.length > 0) {
                  queue$1.shift();
              }
              else {
                  return;
              }
              if (queue$1.length > 0) {
                  queue$1.forEach((item) => {
                      item.zOrder++;
                      let i = 6 - item.zOrder;
                      Tween$4.to(item, {
                          y: 850 - i * 76,
                          scaleX: 1 - i * 0.1,
                          scaleY: 1 - i * 0.1,
                      }, 200);
                  });
                  handMove();
              }
              else {
                  Laya.Scene.open("2.scene", true);
              }
          }
          this.owner.getChildByName("startBtn").on(Event$2.CLICK, this, () => {
              Laya.Scene.open("2.scene", true);
          });
      }
      onDisable() { }
  }

  class GameConfig {
      constructor() {
      }
      static init() {
          var reg = Laya.ClassUtils.regClass;
          reg("script/GuideText.ts", GuideText);
          reg("script/guideBtn.ts", GuideBtn);
          reg("script/GuideRule.ts", GuideRule);
          reg("script/Game.ts", Game);
          reg("script/GameStart.ts", GameStart);
      }
  }
  GameConfig.width = 750;
  GameConfig.height = 1334;
  GameConfig.scaleMode = "fixedauto";
  GameConfig.screenMode = "none";
  GameConfig.alignV = "top";
  GameConfig.alignH = "left";
  GameConfig.startScene = "1.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = false;
  GameConfig.exportSceneToJson = true;
  GameConfig.init();

  class Main {
      constructor() {
          if (window["Laya3D"])
              Laya3D.init(GameConfig.width, GameConfig.height);
          else
              Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
          Laya["Physics"] && Laya["Physics"].enable();
          Laya["DebugPanel"] && Laya["DebugPanel"].enable();
          Laya.stage.scaleMode = GameConfig.scaleMode;
          Laya.stage.screenMode = GameConfig.screenMode;
          Laya.stage.alignV = GameConfig.alignV;
          Laya.stage.alignH = GameConfig.alignH;
          Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
          if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
              Laya.enableDebugPanel();
          if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
              Laya["PhysicsDebugDraw"].enable();
          if (GameConfig.stat)
              Laya.Stat.show();
          Laya.alertGlobalError(true);
          Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
      }
      onVersionLoaded() {
          Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
      }
      onConfigLoaded() {
          GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
      }
  }
  new Main();

}());
