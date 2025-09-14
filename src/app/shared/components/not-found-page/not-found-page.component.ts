import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'shared-not-found-page',
  imports: [],
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {
  location = inject(Location);
  mensaje = input.required<string>();
  goBack() {
    this.location.back();
  }
}
