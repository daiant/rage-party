import {Component, input} from "@angular/core";
import {RageWindow} from "../../../services/window.service";
import {CdkDrag} from "@angular/cdk/drag-drop";

@Component({
  selector: 'rp-desktop-icon',
  template: `
      <button cdkDrag cdkDragBoundary="#desktop" (click)="window().open()">
          <ng-content/>
      </button>`,
  styles: [
    `button {
        border: none;
        background: none;
        padding: 16px;
        display: grid;
        place-items: center;
        color: var(--text-color);
        cursor: pointer;
        user-select: none;
        

        &:hover {
            padding-block-end: 17px;
            margin-block-start: -1px;
            background-color: var(--color-neutral-1);
        }

        &:active {
            padding-block-end: 16px;
            margin-block-start: 0;
        }

        &:focus-visible {
            outline-color: var(--primary-color)
        }
    }`
  ],
  imports: [
    CdkDrag
  ]
})
export class DesktopIcon {
  window = input.required<RageWindow>();
}