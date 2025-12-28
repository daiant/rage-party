import {DOCUMENT, inject} from "@angular/core";

export class RageWindow {
  private NAV_HEIGHT = 38;
  private INITIAL_SIZE = {width: 800, height: 600};
  private INITIAL_POSITION = {top: 100, left: 100};
  public readonly id: string;

  private lastKnownTransform: CSSKeywordValue | CSSTransformValue | undefined;

  private previousSize =  this.INITIAL_SIZE;
  private size = this.INITIAL_SIZE;

  private previousPosition = this.INITIAL_POSITION;
  private position = this.INITIAL_POSITION;



  private maximized = false;
  private document = inject(DOCUMENT);

  constructor() {
    this.id = 'window-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public resize(width: number, height: number) {
    this.previousSize = this.size;
    const safeHeight = height > this.document.body.clientHeight - this.NAV_HEIGHT ? height - this.NAV_HEIGHT : height;
    this.size = {width, height: safeHeight};
  }

  public move(x: number, y: number) {
    this.previousPosition = this.position;
    this.position = {top: y, left: x};
  }

  public get width() {
    return this.size.width;
  }

  public get height() {
    return this.size.height;
  }

  public get top() {
    return this.position.top;
  }

  public get left() {
    return this.position.left;
  }

  private retrieveTransform() {
    this.lastKnownTransform = this.document.body.querySelector(`#${this.id}`)?.computedStyleMap().get('transform') as CSSKeywordValue | CSSTransformValue;
    console.log(this.lastKnownTransform);
  }

  private setTransform(value: CSSTransformValue | CSSKeywordValue | undefined) {
    (this.document.body.querySelector(`#${this.id}`) as HTMLElement)!.style.transform = value?.toString() ?? '';
  }


  public minimize() {
    console.log('Minimizando ventana', this.id);
  }

  public maximize() {
    if(this.maximized) {
      this.resize(this.previousSize.width, this.previousSize.height);
      this.move(this.previousPosition.left, this.previousPosition.top);
      this.setTransform(this.lastKnownTransform);
    } else {
      this.resize(this.document.body.clientWidth, this.document.body.clientHeight);
      this.move(0, 0);
      this.retrieveTransform();
      this.setTransform(new CSSKeywordValue('none'));
    }

    this.maximized = !this.maximized;
  }

  public close() {
    console.log('Cerrando ventana', this.id);
  }
}