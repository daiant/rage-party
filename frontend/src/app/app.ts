import {Component, HostListener, inject, signal} from '@angular/core';
import {Field, form} from "@angular/forms/signals";
import {VideoPlayerComponent} from "./components/video-player";
import {VideoService} from "./services/video.service";
import {RoomService} from "./services/room.service";
import {DirectorService} from "./services/director.service";
import {VideoSearcherComponent} from "./components/video-searcher";

@Component({
  selector: 'app-root',
  imports: [Field, VideoPlayerComponent, VideoSearcherComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
class App {
  form = form(signal({url: '', room: '', name: '', host: false}));
  videoService = inject(VideoService);
  roomService = inject(RoomService);
  directorService = inject(DirectorService);

  @HostListener('keydown.enter', ['$event'])
  onEnter($event: Event) {
    this.search($event);
  }

  protected search($event: Event) {
    const videoId = this.videoService.parseVideoIdByURL(this.form().value().url);
    if (!videoId) return;

    void this.roomService.setVideoId(videoId);
    this.videoService.playVideo(videoId);
    $event.preventDefault();
  }

  protected async joinRoom() {
    const roomId = this.form().value().room;

    if(this.form().value().host) {
      await this.roomService.createRoom(roomId);
    }

    const name = this.form().value().name;
    const room = await this.roomService.joinRoom(roomId, name);
    console.log(room);

    if (!room) return;

    if (room.videoId) this.videoService.playVideo(room.videoId, {
      currentTime: room.playerMetadata?.currentTimestamp,
    });

    void this.directorService.subscribeToEvents(this.roomService, this.videoService);
  }

  onPlayerStateChange = ({data}: { target: any, data: number }) => {
    console.log('Player state changed to: ', data);
    switch (data) {
      // ended
      case 0:
        break;
      // not started
      case -1:
        break;
      // playing
      case 1:
        this.roomService.playVideo();
        break;
      // paused
      case 2:
        this.roomService.pauseVideo();
        break;
      // buffering
      case 3:
        break;
      // video cued
      case 5:
        break;

    }
  }

  protected leaveRoom() {
    void this.roomService.leaveRoom();
  }
}

export default App
