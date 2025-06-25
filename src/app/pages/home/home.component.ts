import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent { }
