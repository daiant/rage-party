import {AfterViewInit, Component, inject, input, OnInit} from '@angular/core';
import {VideoService} from "../services/video.service";

@Component({
  selector: 'ntv-video-player',
  template: '<div id="player" style="height: 600px"></div>',
  standalone: true
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  video = inject(VideoService);
  onPlayerStateChange = input.required<(data: any) => void>();

  ngOnInit(): void {
    this.video.initializePlayer(
      this.onPlayerStateChange(),
      {
        mute: true,
        autoplay: false,
        playsinline: false,
        controls: true,
      });
  }

  ngAfterViewInit() {
    const doc = (<any>window).document;
    const playerApiScript = doc.createElement('script');
    playerApiScript.type = 'text/javascript';
    playerApiScript.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApiScript);
  }
}
