import {AfterViewInit, Component, inject, input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
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
    NgOptimizedImage,
    VideoThumbnailComponent
  ],
  standalone: true
})
export class VideoPlayerComponent implements AfterViewInit {
  video = inject(VideoService);
  roomService = inject(RoomService);
  onPlayerStateChange = input.required<(data: any) => void>();

  ngAfterViewInit() {
    this.video.initializePlayer(
      this.onPlayerStateChange(),
      {
        autoplay: false,
        playsinline: false,
        showInfo: false,
        rel: false,
        controls: true,
        disablekb: true
      });
  }
}
