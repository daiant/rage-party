import {Component, HostListener, inject, signal} from '@angular/core';
import {Field, form} from "@angular/forms/signals";
import {VideoPlayerComponent} from "./components/video-player";
import {VideoService} from "./services/video.service";
import {RoomService} from "./services/room.service";

@Component({
  selector: 'app-root',
  imports: [Field, VideoPlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
class App {
  eventsReceived = signal<string[]>([]);
  form = form(signal({url: '', room: '', name: ''}));
  videoService = inject(VideoService);
  roomService = inject(RoomService);

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
    const name = this.form().value().name;
    const room = await this.roomService.joinRoom(roomId, name);

    if (!room) return;

    if (room.videoId) this.videoService.playVideo(room.videoId, {
      currentTime: room.playerMetadata?.currentTimestamp,
    });

    void this.subscribeToEvents(roomId)
  }

  private async subscribeToEvents(roomId: string): Promise<void> {
    const response = await this.roomService.getEvents();

    if (!response.ok) {
      throw Error(response.statusText);
    }

    for (const reader = response.body?.getReader(); ;) {
      if (!reader) throw new Error('No reader found');

      const {value, done} = await reader.read();

      if (done) {
        break;
      }

      const chunk = new TextDecoder().decode(value).replace(/data: /g, '').trim();
      const subchunks = chunk.split('\n\n').filter(Boolean);
      for (const subchunk of subchunks) {
        const event = JSON.parse(subchunk) as {
          data?: any,
          type: 'timestamp_request' | 'player_metadata' | (string & {}),
          consumed: boolean,
          id: string
        };
        this.eventsReceived.set([...this.eventsReceived(), subchunk]);

        // These chunks have all the events and info of the player
        if (event.type === 'timestamp_request') {
          await this.roomService.setPlayerMetadata(roomId, {currentTimestamp: this.videoService.getCurrentTime()});
        } else if (event.type === 'player_metadata') {
          const playerMetadata = event.data;

          if(playerMetadata.state) {
            if(playerMetadata.state == 2) {
              this.videoService.pauseVideo();
            } else if( playerMetadata.state == 1 ) {
              this.videoService.resumeVideo();
            }
          }

          if(playerMetadata.currentTimestamp) {
            this.videoService.seekTo(playerMetadata.currentTimestamp);
          }

        }
      }
    }
  }

  onPlayerStateChange = ({data}: { target: any, data: number }) => {
    switch (data) {
      // ended
      case 0:
        break;
      // not started
      case -1:
        break;
      // playing
      case 1:
        this.roomService.setPlayerStatus(data, false);
        break;
      // paused
      case 2:
        this.roomService.setPlayerStatus(data, false);
        break;
      // buffering
      case 3:
        break;
      // video cued
      case 5:
        break;

    }
  }

}

export default App
