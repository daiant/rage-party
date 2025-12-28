import {Component, inject, signal} from "@angular/core";
import {RoomService} from "../../services/room.service";
import {Field, form, readonly} from "@angular/forms/signals";
import {Router} from "@angular/router";
import {Button} from "../../components/ui/button/button";
import {Input} from "../../components/ui/input/input";
import {Logo} from "../../components/ui/logo/logo";

@Component({
  standalone: true,
  templateUrl: './room-searcher.html',
  imports: [
    Field,
    Button,
    Input,
    Logo,
  ],
  styleUrl: "./room-searcher.css"
})
export class RoomSearcher {
  form = form(signal({room: '', name: '', host: false}) );
  roomService = inject(RoomService);
  router = inject(Router);

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

  protected onHostValueChange() {
    console.log('me llame');
    this.form.host().value.update(value => !value);
  }
}