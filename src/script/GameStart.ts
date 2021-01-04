import MoonCake from "../element/MoonCake";
import Tween = Laya.Tween;
import Sprite = Laya.Sprite;
import Ease = Laya.Ease;
import Handler = Laya.Handler;
import Event = Laya.Event;

const MAX_SIZE: number = 6;
const queue: Array<MoonCake> = new Array<MoonCake>(MAX_SIZE);

export default class GameStart extends Laya.Script {
  constructor() {
    super();
  }
  /**
   * 初始化页面
   */
  private init(): void {
    let _mooncake: MoonCake;
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

  onAwake(): void {
    this.init();
    const tweenProps1: object = { scaleX: 1.25, scaleY: 1.25 };
    const tweenProps2: object = { scaleX: 1, scaleY: 1 };
    const _eat: Sprite = this.owner.getChildByName("eat") as Sprite;
    const _go: Sprite = this.owner.getChildByName("go") as Sprite;
    const duringTime: number = 1000;

    function tweenLoopRight(): void {
      Tween.to(
        _eat,
        tweenProps1,
        duringTime,
        Ease.linearInOut,
        Handler.create(this, () => {
          Tween.to(_eat, tweenProps2, duringTime);
        }),
        null,
        true
      );
    }

    function tweenLoopLeft(): void {
      Tween.to(
        _go,
        tweenProps1,
        duringTime,
        Ease.linearInOut,
        Handler.create(this, () => {
          Tween.to(_go, tweenProps2, duringTime);
        }),
        null,
        true
      );
    }

    Laya.timer.loop(2 * duringTime, this, tweenLoopRight);
    setTimeout(() => {
      Laya.timer.loop(2 * duringTime, this, tweenLoopLeft);
    }, 1000);
  }

  onEnable(): void {
    const hand: Sprite = this.owner.scene.getChildByName("hand") as Sprite;
    const THIS_SCENE: Scene = this.owner.scene;

    function handMove() {
      const toRight: object = { alpha: 1, x: 871 };
      const toLeft: object = { alpha: 1, x: -123 };
      Tween.clearAll(hand);
      hand.x = 375;
      if (queue.length > 0) {
        if (queue[0].cakeType == 0) {
          Tween.to(hand, toLeft, 1000).repeat = 0;
        } else {
          Tween.to(hand, toRight, 1000).repeat = 0;
        }
      } else {
        THIS_SCENE.removeChild(hand);
        // Laya.stage.removeChild(hand);
      }
    }

    handMove();

    let currentMoonCake: MoonCake;
    /**
     * 拖动月饼
     * oprerationas when draging mooncake
     */
    function dragCake(): void {
      currentMoonCake = queue[0];
      currentMoonCake.x = Laya.stage.mouseX;
    }
    function removeCake(): void {
      currentMoonCake = queue[0];

      const callbackFn: globalThis.Handler = Handler.create(this, () => {
        Laya.stage.removeChild(currentMoonCake);
        queueUpdate();
      });

      if (currentMoonCake.x - 375 < 0) {
        Tween.to(
          currentMoonCake,
          { x: -100, alpha: 0 },
          200,
          Ease.linearNone,
          callbackFn
        );
      } else {
        Tween.to(
          currentMoonCake,
          { x: 850, alpha: 0 },
          200,
          Ease.linearNone,
          callbackFn
        );
      }
    }

    Laya.stage.on(Event.MOUSE_MOVE, this, dragCake);
    Laya.stage.on(Event.MOUSE_UP, this, removeCake);

    function queueUpdate(): void {
      if (queue.length > 0) {
        queue.shift();
      } else {
        return;
      }
      if (queue.length > 0) {
        queue.forEach((item) => {
          item.zOrder++;
          let i: number = 6 - item.zOrder;
          Tween.to(
            item,
            {
              y: 850 - i * 76,
              scaleX: 1 - i * 0.1,
              scaleY: 1 - i * 0.1,
            },
            200
          );
        });
        // // 游戏指引不添加新的月饼
        // let _newCake:MoonCake = new MoonCake();
        // _newCake.x = 375;
        // _newCake.y = 470;
        // _newCake.scale(0,0);
        // _newCake.zOrder = 1;
        // THIS_SCENE.addChildren(_newCake);
        // Tween.to(_newCake,{scaleX:0.5,scaleY:0.5},200);
        // queue.push(_newCake);
        handMove();
      } else {
        Laya.Scene.open("2.scene", true);
      }
    }
    this.owner.getChildByName("startBtn").on(Event.CLICK, this, () => {
      Laya.Scene.open("2.scene", true);
    });
  }

  onDisable(): void {}
}
