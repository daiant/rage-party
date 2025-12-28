import {AfterViewInit, Component, inject, input} from '@angular/core';
import {VideoService} from "../../services/video.service";
import {RoomService} from "../../services/room.service";
import {VideoThumbnailComponent} from "../video-thumbnail/video-thumbnail";

@Component({
  selector: 'ntv-video-player',
  styleUrl: 'video-player.css',
  template: `
      <div class="video-container">
          <div id="player" style="height: 600px"></div>
          @if (roomService.getPlaylist().length > 0) {
              <div class="playlist">
                  <button (click)="roomService.requestNextVideo()">Next</button>
                  @for (video of roomService.getPlaylist(); track video) {
                      <rp-video-thumbnail [video]="video" [controls]="false"
                                          (select)="roomService.requestNextVideoFromPlaylist(video)"/>
                  }
              </div>
          }

      </div>
  `,
  imports: [
    VideoThumbnailComponent
  ],
  standalone: true
})
export class VideoPlayerComponent implements AfterViewInit {
  video = inject(VideoService);
  roomService = inject(RoomService);

  ngAfterViewInit() {
    this.video.initializePlayer(
      this.onPlayerStateChange,
      {
        autoplay: false,
        playsinline: false,
        showInfo: false,
        rel: false,
        controls: true,
        disablekb: true
      });
  }

  onPlayerStateChange = ({data}: { target: any, data: number }) => {
    console.log('Player state changed to: ', data);
    switch (data) {
      // ended
      case 0:
        this.roomService.requestNextVideo();
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
}
