import {Component, inject, signal} from "@angular/core";
import {Field, form} from "@angular/forms/signals";
import {VideoSearcherService, VideoThumbnail} from "../services/video-searcher.service";
import {VideoThumbnailComponent} from "./video-thumbnail/video-thumbnail";
import {RoomService} from "../services/room.service";
import {Input} from "./ui/input/input";
import {Button} from "./ui/button/button";

@Component({
  selector: 'rp-video-searcher',
  template: `
      <div style="display: flex;gap: 4px;margin-block: 2px; align-items: center">
          <rp-input style="flex: 1" type="text" placeholder="Search" [field]="form.search" (keydown.enter)="search()"/>
          <rp-button variant="secondary" (onClick)="search()">Search</rp-button>
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
    VideoThumbnailComponent,
    Input,
    Button
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