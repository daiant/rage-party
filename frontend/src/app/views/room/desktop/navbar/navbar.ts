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