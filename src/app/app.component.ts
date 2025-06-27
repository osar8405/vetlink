import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoginComponent } from "./cuenta/login/login.component";
import { LoginModalComponent } from "./shared/components/login-modal/login-modal.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoginComponent, LoginModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'vetlink';
  loginVisible = signal(false);

  mostrarLogin() {
    this.loginVisible.set(true);
  }

  cerrarLogin() {
    this.loginVisible.set(false);
  }
}
