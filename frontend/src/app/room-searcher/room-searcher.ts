import {Component, inject, signal} from "@angular/core";
import {RoomService} from "../services/room.service";
import {Field, form, readonly} from "@angular/forms/signals";
import {Router} from "@angular/router";

@Component({
  standalone: true,
  templateUrl: './room-searcher.html',
  imports: [
    Field,
  ],
  styleUrl: "./room-searcher.css"
})
export class RoomSearcher {
  form = form(signal({room: '', name: '', host: false}), schemaPath => {
    readonly(schemaPath.room, () => this.nameStep());
  });
  roomService = inject(RoomService);
  router = inject(Router);
  nameStep = signal(false);

  protected async joinRoom() {
    const roomId = this.form().value().room;

    if(this.form().value().host) {
      await this.roomService.createRoom(roomId);
    }

    const name = this.form().value().name;
    const room = await this.roomService.joinRoom(roomId, name);

    if (!room) return;
    void this.router.navigate(['/now-playing']);
  }

  protected async searchRoom() {
    this.nameStep.set(true);
  }
}