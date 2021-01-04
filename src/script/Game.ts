import MoonCake from "../element/MoonCake";
import Tween = Laya.Tween;
import Sprite = Laya.Sprite;
import Ease = Laya.Ease;
import Handler = Laya.Handler;
import Event = Laya.Event;
import Label = Laya.Label;

const MAX_SIZE: number = 6;
const queue: Array<MoonCake> = new Array<MoonCake>(MAX_SIZE);

export default class Game extends Laya.Script {
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
  }

  onEnable(): void {
    const THIS_SCENE: Scene = this.owner.scene;
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
        currentMoonCake.destroy(true);
        queueUpdate();
      });

      if (Laya.stage.mouseX - 375 < 0) {
        addScore("left");
        Tween.to(
          currentMoonCake,
          { x: -190, alpha: 0 },
          200,
          Ease.linearNone,
          callbackFn
        );
      } else {
        addScore("right");
        Tween.to(
          currentMoonCake,
          { x: 940, alpha: 0 },
          200,
          Ease.linearNone,
          callbackFn
        );
      }
    }

    function addScore(direction: string) {
      const addScore: Sprite = THIS_SCENE.getChildByName("add") as Sprite;
      const minusScore: Sprite = THIS_SCENE.getChildByName("minus") as Sprite;
      const scoreText: Label = THIS_SCENE.getChildByName("scoreText") as Label;
      addScore.y = 560;
      minusScore.y = 560;
      if (
        (currentMoonCake.cakeType == 0 && direction == "left") ||
        (currentMoonCake.cakeType == 1 && direction == "right")
      ) {
        scoreText.text = parseInt(scoreText.text) + 1 + "";
        Tween.to(
          addScore,
          { alpha: 1, y: 260 },
          200,
          Ease.linearNone,
          Handler.create(this, () => {
            Tween.to(addScore, { alpha: 0 }, 200, Ease.linearNone);
          })
        );
      } else {
        scoreText.text = parseInt(scoreText.text) - 2 + "";
        Tween.to(
          minusScore,
          { alpha: 1, y: 260 },
          200,
          Ease.linearNone,
          Handler.create(this, () => {
            Tween.to(minusScore, { alpha: 0 }, 200, Ease.linearNone);
          })
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
        // 添加新的月饼
        let _newCake: MoonCake = new MoonCake();
        _newCake.x = 375;
        _newCake.y = 470;
        _newCake.scale(0, 0);
        _newCake.zOrder = 1;
        THIS_SCENE.addChildren(_newCake);
        Tween.to(_newCake, { scaleX: 0.5, scaleY: 0.5 }, 200);
        queue.push(_newCake);
      } else {
        Laya.Scene.open("2.scene", true);
      }
    }

    const timer: Label = THIS_SCENE.getChildByName("timer") as Label;
    let _count: number = 60;

    Laya.timer.loop(1000, this, () => {
      _count--;
      if (_count >= 10) {
        timer.text = "00:" + _count;
      } else {
        timer.text = "00:0" + _count;
      }
      if (_count == 0) {
        // Laya.Scene.open("1.scene", true);
        openResult();
      }
    });

    function openResult(): void {
      Laya.stage.off(Event.MOUSE_MOVE, this, dragCake);
      Laya.stage.off(Event.MOUSE_UP, this, removeCake);
      const result: Sprite = new Sprite();
      result.loadImage("img/mask.png");
      result.alpha = 0.7;
      result.x = 0;
      result.y = 0;
      result.zOrder = 999;
      const scoreLabel: Label = new Label();
      scoreLabel.color = "#ffffff";
      scoreLabel.fontSize = 50;
      scoreLabel.align = "center";
      scoreLabel.text =
        "最终得分：" + (THIS_SCENE.getChildByName("scoreText") as Label).text;
      scoreLabel.pivot(scoreLabel.width / 2, scoreLabel.height / 2);
      scoreLabel.x = 375;
      scoreLabel.y = 444;
      result.addChild(scoreLabel);
      result.on(Event.CLICK, this, () => {
        Laya.Scene.open("1.scene", true);
      });
      THIS_SCENE.addChild(result);
    }
  }

  onDisable(): void {}
}
