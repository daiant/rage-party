import {Component, inject, input, output} from "@angular/core";
import {Button} from "../../../../components/ui/button/button";
import {Logo} from "../../../../components/ui/logo/logo";
import {RageWindow} from "../../../../services/window.service";
import {RoomService} from "../../../../services/room.service";

@Component({
  selector: 'rp-navbar',
  template: `
      <nav>
          <rp-logo/>
          <ul class="opened-windows">
              @for (openedWindow of openedWindows(); track openedWindow.id) {
                  <li (click)="openedWindow.toggleOpen()">{{ openedWindow.title }}</li>
              }
          </ul>
          <div class="control-center">
              <rp-button variant="text" ngMenuTrigger>
                  <span style="text-transform: uppercase;font-weight: 400">Habitación <strong>{{ room.joinedRoomId() }}</strong></span>
              </rp-button>
              <rp-button variant="text" (onClick)="onLeave.emit()">Salir</rp-button>
          </div>
      </nav>
  `,
  standalone: true,
  styleUrl: './navbar.css',
  imports: [
    Button,
    Logo
  ]
})
export class Navbar {
  room = inject(RoomService);
  openedWindows = input.required<RageWindow[]>();
  onLeave = output<void>();
}