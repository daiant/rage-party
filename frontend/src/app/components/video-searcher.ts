import {Component, inject, signal} from "@angular/core";
import {Field, form} from "@angular/forms/signals";
import {VideoSearcherService, VideoThumbnail} from "../services/video-searcher.service";
import {NgOptimizedImage} from "@angular/common";
import {VideoService} from "../services/video.service";

@Component({
  selector: 'rp-video-searcher',
  template: `
      <div>
          <input type="text" placeholder="Enter video url" [field]="form.search">
          <button type="button" (click)="search()">Search</button>
      </div>
      <div style="display: flex; align-items: center;">
          @for (video of videos(); track video.id) {
              <div role="button" (click)="select(video.id)">
                  <img [ngSrc]="video.thumbnail" alt="Thumbnail" style="margin-right: 10px;" width="120"
                       height="90">
              </div>
          }
      </div>
  `,
  standalone: true,
  imports: [
    Field,
    NgOptimizedImage
  ],
})
export class VideoSearcherComponent {
  private readonly videoSearcherService = inject(VideoSearcherService);
  private readonly videoService = inject(VideoService);

  readonly form = form(signal({search: ''}));
  readonly videos = signal<VideoThumbnail[]>([]);

  readonly search = () => {
    this.videos.set([]);
    console.log(this.form().value().search);
    this.videoSearcherService.search(this.form().value().search).then(videos => this.videos.set(videos));
  }

  protected select(videoId: string) {
     this.videoService.playVideo(videoId, {currentTime: 0});
  }
}