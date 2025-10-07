import { Component, ViewChild, input, output } from '@angular/core';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'icon-delete',
  imports: [ConfirmModalComponent],
  templateUrl: './icon-delete.component.html',
})
export class IconDeleteComponent {
  registroId = input<string | number>();
  confirmar = output<void>();
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  abrirModal() {
    this.deleteModal.show();
  }

  confirmarEliminacion() {
    this.confirmar.emit();
  }
}
