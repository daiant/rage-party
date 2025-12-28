import {Component, input, output} from "@angular/core";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
  selector: 'rp-window',
  templateUrl: './window.component.html',
  styleUrl: './window.component.css',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle],
})
export class WindowComponent {
  readonly title = input<string>('');
}