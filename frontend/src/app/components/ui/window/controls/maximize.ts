import {Component, output} from "@angular/core";

@Component({
  selector: 'rp-window-maximize',
  template: `
      <button class="window-control" (click)="onClick.emit($event)" title="Maximize">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"></path>
          </svg>
      </button>
  `,
  standalone: true,
  styleUrl: './controls.component.css',
})
export class Maximize {
  onClick = output<Event>();
}