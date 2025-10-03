import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { FrontFooterComponent } from "../../components/front-footer/front-footer.component";

@Component({
  selector: 'app-vet-link-front-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FrontFooterComponent],
  templateUrl: './vetLink-front-layout.component.html',
})
export class VetLinkFrontLayoutComponent { }
