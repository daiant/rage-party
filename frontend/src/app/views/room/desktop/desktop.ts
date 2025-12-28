import {Component} from "@angular/core";
import {RageWindow} from "../../../services/window.service";
import {WindowComponent} from "../../../components/ui/window/window.component";
import {VideoPlayerComponent} from "../../../components/video-player/video-player";
import {VideoSearcherComponent} from "../../../components/video-searcher";

@Component({
  selector: 'rp-desktop',
  template: `
      <div id="desktop" style="height: 100%;">
          <rp-window [window]="videoWindow">
              <rp-video-searcher/>
              <ntv-video-player />
          </rp-window>
      </div>`,
  imports: [
    WindowComponent,
    VideoPlayerComponent,
    VideoSearcherComponent
  ]
})
export class Desktop {
  readonly videoWindow = new RageWindow();
}