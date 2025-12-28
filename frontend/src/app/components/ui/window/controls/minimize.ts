import {Component, output} from "@angular/core";

@Component({
  selector: 'rp-window-minimize',
  template: `<button class="window-control" (click)="onClick.emit($event)">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path></svg>
  </button>`,
  standalone: true,
  styleUrl: './controls.component.css',
})
export class Minimize {
  onClick = output<Event>();
}