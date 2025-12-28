import {Component, input} from "@angular/core";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {Minimize} from "./controls/minimize";
import {Maximize} from "./controls/maximize";
import {Close} from "./controls/close";
import {RageWindow} from "../../../services/window.service";

@Component({
  selector: 'rp-window',
  templateUrl: './window.component.html',
  styleUrl: './window.component.css',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, Minimize, Maximize, Close],
})
export class WindowComponent {
  readonly window = input.required<RageWindow>();
}