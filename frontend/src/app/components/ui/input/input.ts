import {Component, input, model} from "@angular/core";
import {Field, FormValueControl, ValidationError} from "@angular/forms/signals";

@Component({
  selector: 'rp-input',
  templateUrl: './input.html',
  styleUrl: './input.css',
  standalone: true,
})
export class Input implements FormValueControl<string>{
  readonly label = input<string>('');
  readonly value = model<string>('');

  readonly disabled = input<boolean>(false);
  readonly touched = input<boolean>(false);
  readonly type = input<'text' | 'number' | 'password'>('text');
  readonly placeholder = input<string>('');
}