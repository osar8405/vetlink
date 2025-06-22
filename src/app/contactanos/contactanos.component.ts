import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'contactanos',
  imports: [],
  templateUrl: './contactanos.component.html',
})
export class ContactanosComponent {
  name = '';
  email = '';
  subject = '';
  message = '';

  sendMessage() {
    console.log({
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message
    });
    // Aquí puedes disparar el POST a una API o lo que ocupes
  }
 }
