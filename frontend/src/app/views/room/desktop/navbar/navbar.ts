import {Component, inject, input, output} from "@angular/core";
import {Button} from "../../../../components/ui/button/button";
import {Logo} from "../../../../components/ui/logo/logo";
import {RageWindow} from "../../../../services/window.service";
import {RoomService} from "../../../../services/room.service";
import {CdkMenuModule} from "@angular/cdk/menu";
import {ConnectionPositionPair} from "@angular/cdk/overlay";

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
              <rp-button variant="text" [cdkMenuTriggerFor]="menu" [cdkMenuPosition]="positions">
                  <span style="text-transform: uppercase;font-weight: 400">Habitación <strong>{{ room.joinedRoomId() }}</strong></span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"></path></svg>
              </rp-button>
          </div>
      </nav>
      
      <ng-template #menu>
          <div class="navbar-menu" cdkMenu>
              <span cdkMenuItem>{{room.getName()}}</span>
              <span cdkMenuItem>{{room.getListeners().length}} listeners</span>
              <rp-button (onClick)="onLeave.emit()" fontSize="small" cdkMenuItem>Salir</rp-button>
          </div>
      </ng-template>  
  `,
  standalone: true,
  styleUrl: './navbar.css',
  imports: [
    Button,
    Logo,
    CdkMenuModule,
  ]
})
export class Navbar {
  room = inject(RoomService);
  openedWindows = input.required<RageWindow[]>();
  onLeave = output<void>();

  readonly positions = [new ConnectionPositionPair({originX: 'end', originY: 'bottom'}, {overlayX: 'end', overlayY: 'top'})]
}