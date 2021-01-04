import Tween = Laya.Tween;
import Sprite = Laya.Sprite;
import Event = Laya.Event;

export default class GuideRule extends Laya.Script {
  constructor() {
    super();
  }
  private _mask:Sprite;
  onAwake(): void {   
    const _mask: Sprite = new Sprite();
    this._mask = _mask;    
    _mask.loadImage("img/mask.png");
    _mask.pivot(375,667);
    _mask.x = 375;
    _mask.y = 667;
    _mask.alpha = 0.7;
    _mask.zOrder = -1;
    _mask.scale(0,0);
    _mask.name = "mask";
    const _close:Sprite = new Sprite();
    _close.loadImage("img/close.png");
    _close.scale(0.5,0.5);
    _close.x = 620;
    _close.y = 60;
    _close.on(Event.CLICK, this, this.maskClose);
    _mask.addChild(_close);
    this.owner.scene.addChild(_mask);
    
  }

  onClick(): void {
    Tween.to(this._mask, { scaleX: 1, scaleY: 1, zOrder: 1 }, 500);
  }

  maskClose():void {
    Tween.to(this._mask, { scaleX: 0, scaleY: 0, zOrder: -1 }, 500);
  }
}
