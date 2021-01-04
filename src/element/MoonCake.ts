export default class MoonCake extends Laya.Sprite {
  // 月饼类型，0无黄，1双黄
  cakeType: Number;
  constructor() {
    super();
    this.cakeType = Math.random() > 0.5 ? 0 : 1;
    this.loadImage(
      this.cakeType == 0
        ? "http://enbrands.oss-cn-shenzhen.aliyuncs.com/game/midAutumn/images/IMG_GAME_FIGURE_1.png"
        : "http://enbrands.oss-cn-shenzhen.aliyuncs.com/game/midAutumn/images/IMG_GAME_FIGURE_2.png"
    );
    this.pivot(380 / 2, 407 / 2);
  }
}
