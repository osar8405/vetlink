import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'icon-edit',
  imports: [CommonModule],
  templateUrl: './icon-edit.component.html',
})
export class IconEditComponent {
  iconSrc = input<string>(''); // ruta al SVG
  alt = input<string>('icon'); // texto alternativo
  label = input<string>(''); // texto opcional
  color = input<'primary' | 'error' | 'neutral'>('primary'); // color DaisyUI
  clicked = output<void>(); // evento

  onClick() {
    this.clicked.emit();
  }
}
