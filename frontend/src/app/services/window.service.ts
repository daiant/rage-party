import {DOCUMENT, inject} from "@angular/core";

export class RageWindow {
  private NAV_HEIGHT = 38;
  private INITIAL_SIZE = {width: 800, height: 600};
  private INITIAL_POSITION: {top: string | number, left: string | number} = {top: 0, left: 0};
  public readonly id: string;

  private lastKnownTransform: CSSKeywordValue | CSSTransformValue | undefined;

  private previousSize =  this.INITIAL_SIZE;
  private size = this.INITIAL_SIZE;

  private previousPosition = this.INITIAL_POSITION;
  private position = this.INITIAL_POSITION;

  private state: 'normal' | 'maximized' | 'minimized' | 'closed' = 'normal';
  private document = inject(DOCUMENT);

  constructor() {
    this.id = 'window-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public resize(width: number, height: number) {
    this.previousSize = this.size;
    const safeHeight = height > this.document.body.clientHeight - this.NAV_HEIGHT ? height - this.NAV_HEIGHT : height;
    this.size = {width, height: safeHeight};
  }

  public move(x: string | number, y: string | number) {
    this.previousPosition = JSON.parse(JSON.stringify(this.position));
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
  }

  private setTransform(value: CSSTransformValue | CSSKeywordValue | undefined) {
    (this.document.body.querySelector(`#${this.id}`) as HTMLElement)!.style.transform = value?.toString() ?? '';
  }

  public minimize() {
    this.move(-10000, -10000);
    this.state = 'minimized';
  }

  public open() {
    if(this.state === 'closed') {
      this.state = 'normal'
    } else if(this.state === 'minimized') {
      this.move(this.previousPosition.left, this.previousPosition.top);
      this.state = 'normal';
    }
  }

  public maximize() {
    if(this.state === 'maximized') {
      this.resize(this.previousSize.width, this.previousSize.height);
      this.move(this.previousPosition.left, this.previousPosition.top);
      this.setTransform(this.lastKnownTransform);
      this.state = 'normal';
    } else {
      this.resize(this.document.body.clientWidth, this.document.body.clientHeight);
      this.move(0, 0);
      this.retrieveTransform();
      this.setTransform(new CSSKeywordValue('none'));
      this.state = 'maximized';
    }
  }

  public close() {
    this.state = 'closed';
  }

  isOpen() {
    return this.state !== 'closed';
  }
}