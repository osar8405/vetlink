import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-vet-link-front-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './vetLink-front-layout.component.html',
})
export class VetLinkFrontLayoutComponent { }
