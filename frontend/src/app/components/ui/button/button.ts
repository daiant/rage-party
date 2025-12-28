import {Component, input, output} from "@angular/core";

@Component({
  selector: 'rp-button',
  templateUrl: './button.html',
  styleUrl: './button.css',
  standalone: true,
})
export class Button {
  readonly onClick = output<Event>();
  readonly variant = input<'primary' | 'secondary' | 'text'>('primary');
  readonly fontSize = input<'small' | 'medium' | 'large'>('medium');
}