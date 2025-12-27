import {Component, inject, signal} from "@angular/core";
import {Field, form} from "@angular/forms/signals";
import {VideoSearcherService, VideoThumbnail} from "../services/video-searcher.service";
import {VideoThumbnailComponent} from "./video-thumbnail/video-thumbnail";
import {RoomService} from "../services/room.service";

@Component({
  selector: 'rp-video-searcher',
  template: `
      <div>
          <input type="text" placeholder="Search" [field]="form.search">
          <button type="button" (click)="search()">Search</button>
      </div>
      <div style="display: flex; align-items: flex-start;gap: 16px; overflow: scroll;margin-block: 16px">
          @for (video of videos(); track video.id) {
              <rp-video-thumbnail
                      [video]="video"
                      [controls]="true"
                      (select)="room.setVideoId(video.id)"
                      (cue)="room.addVideoToPlaylist(video)"
              />
          }
      </div>
  `,
  standalone: true,
  imports: [
    Field,
    VideoThumbnailComponent
  ],
})
export class VideoSearcherComponent {
  private readonly videoSearcherService = inject(VideoSearcherService);
  readonly room = inject(RoomService);

  readonly form = form(signal({search: ''}));
  readonly videos = signal<VideoThumbnail[]>([]);

  readonly search = () => {
    this.videos.set([]);
    this.videoSearcherService.search(this.form().value().search).then(videos => this.videos.set(videos));
  }
}