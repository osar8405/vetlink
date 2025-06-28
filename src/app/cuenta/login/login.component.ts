import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

onSubmit() {
  // this.authService.login(this.form.value).subscribe({
  //   next: () => {
      this.loginSuccess.emit(); // <-- cierra modal desde afuera
  //   },
  //   error: () => {
  //     // muestra error
  //   },
  // });
 }
}
