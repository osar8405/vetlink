import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoginComponent } from "./cuenta/login/login.component";
import { Router, NavigationEnd } from '@angular/router';
import { AlertComponent } from "./shared/components/alert/alert.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'vetlink';
  loginVisible = signal(false);
  showLayout: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rutasSinLayout = ['/login', '/register'];
        this.showLayout = !rutasSinLayout.includes(event.urlAfterRedirects);
      }
    });
  }

  mostrarLogin() {
    this.loginVisible.set(true);
  }

  cerrarLogin() {
    this.loginVisible.set(false);
  }
}
