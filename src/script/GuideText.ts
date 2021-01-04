import Sprite = Laya.Sprite;
import Tween = Laya.Tween;
import Ease = Laya.Ease;
import Handler = Laya.Handler;

export default class GuideText extends Laya.Script {
  constructor() {
    super();
  }

  onEnable(): void {
    const guideText: Sprite = this.owner as Sprite;
    const tweenProps1: object = { scaleX: 1, scaleY: 1 };
    const tweenProps2: object = { scaleX: 0.8, scaleY: 0.8 };
    const duringTime: number = 350;

    function tweenLoop(): void {
      Tween.to(
        guideText,
        tweenProps1,
        duringTime,
        Ease.linearInOut,
        Handler.create(this, () => {
          Tween.to(guideText, tweenProps2, duringTime);
        }),
        null,
        true
      );
    }

    Laya.timer.loop(700, this, tweenLoop);
  }

  onDisable(): void {}
}
