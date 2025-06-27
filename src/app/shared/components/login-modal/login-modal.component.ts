import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LoginComponent } from '../../../cuenta/login/login.component';

@Component({
  selector: 'shared-login-modal',
  imports: [LoginComponent],
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() closed = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (this.visible) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }

  closeModal() {
    this.visible = false;
    document.body.classList.remove('overflow-hidden'); // por si las dudas
    this.closed.emit();
  }
}
