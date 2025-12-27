import {AfterViewInit, Component, computed, inject, OnInit} from "@angular/core";
import {RoomService} from "../services/room.service";
import {VideoSearcherComponent} from "../components/video-searcher";
import {VideoPlayerComponent} from "../components/video-player/video-player";
import {VideoService} from "../services/video.service";
import {DirectorService} from "../services/director.service";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  templateUrl: './room.html',
  imports: [
    VideoSearcherComponent,
    VideoPlayerComponent
  ],
  standalone: true
})
export class RoomComponent {
  room = inject(RoomService);
  video = inject(VideoService);
  directorService = inject(DirectorService);
  router = inject(Router);

  constructor() {
    if(!this.room.anyRoomJoined()) {
      void this.router.navigate(['/']);
      return;
    }
    void this.directorService.subscribeToEvents(this.room, this.video);
    void this.updateCurrentVideo();
  }


  async updateCurrentVideo() {
    const currentVideo = await this.room.getCurrentVideo();
    if(!currentVideo?.videoId) return;

    const startTime = Date.now();
    console.log('Waiting for video to be ready...');
    this.video.ready.subscribe({
      next: (value) => {
        console.log(value)
        if(value) {
          console.log(`Video ready in ${Date.now() - startTime}ms`);
          this.video.playVideo(currentVideo.videoId, {currentTime: currentVideo.currentTimestamp});
        }
      }
    });
  }

  onPlayerStateChange = ({data}: { target: any, data: number }) => {
    console.log('Player state changed to: ', data);
    switch (data) {
      // ended
      case 0:
        this.room.requestNextVideo();
        break;
      // not started
      case -1:
        break;
      // playing
      case 1:
        this.room.playVideo();
        break;
      // paused
      case 2:
        this.room.pauseVideo();
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
    void this.room.leaveRoom();
    void this.video.stopVideo();
    void this.router.navigate(['/']);
  }
}