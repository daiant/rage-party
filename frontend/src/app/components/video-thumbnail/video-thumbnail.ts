import {Component, inject, input, output} from "@angular/core";
import { SlicePipe} from "@angular/common";
import {VideoThumbnail} from "../../services/video-searcher.service";
import {RoomService} from "../../services/room.service";

@Component({
    selector: 'rp-video-thumbnail',
    template: `
        <div role="button" (click)="select.emit()">
            <img [src]="video().thumbnail" alt="Thumbnail">
            <p>{{ video().title | slice:0:30 }}</p>
        </div>
        @if (controls()) {
            <div class="actions">
                <button type="button" (click)="select.emit()">
                    Reproducir
                </button>
                <button type="button" (click)="cue.emit()">
                    A la cola
                </button>
            </div>
        }
    `,
  imports: [
    SlicePipe
  ],
  styleUrl: 'video-thumbnail.css',
  }
)
export class VideoThumbnailComponent {
  video = input.required<Pick<VideoThumbnail, 'id' | 'title' | 'thumbnail'>>();
  controls = input(true);

  select = output();
  cue = output();
}
