import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

onSubmit() {
  // this.authService.login(this.form.value).subscribe({
  //   next: () => {
  //     this.loginSuccess.emit(); // <-- cierra modal desde afuera
  //   },
  //   error: () => {
  //     // muestra error
  //   },
  // });
 }
}
