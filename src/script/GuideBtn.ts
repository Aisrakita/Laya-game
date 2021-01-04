import Sprite = Laya.Sprite;
import Tween = Laya.Tween;
import Ease = Laya.Ease;
import Handler = Laya.Handler;

export default class GuideBtn extends Laya.Script {
  constructor() {
    super();
  }

  onEnable(): void {
    const guideBtn = this.owner as Sprite;
    guideBtn.x = 196 + 358 / 2;
    guideBtn.y = 1110 + 125 / 2;
    guideBtn.pivotX = 358 / 2;
    guideBtn.pivotY = 125 / 2;
    guideBtn.rotation = -5;
    function tweenLoop(): void {
      Tween.to(
        guideBtn,
        { rotation: 5 },
        300,
        Ease.linearNone,
        Handler.create(this, () => {
          Tween.to(guideBtn, { rotation: -5 }, 300);
        })
      );
    }
    Laya.timer.loop(600, this, tweenLoop);
  }

  onDisable(): void {}

  onClick(): void {
      Laya.Scene.open("gameScene.scene",true);
  }
}
