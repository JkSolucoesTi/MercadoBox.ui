import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalComponent } from '../shared/modal/modal.component';
import { EventEmitterService } from './event-emitter.service';
import { ItemCarrinho } from '../model/carrinho/itemCarrinho';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  dialog?: DynamicDialogRef

  constructor(private dialogService: DialogService, private eventEmitter: EventEmitterService) { }

  openModal() {
    this.dialog = this.dialogService.open(ModalComponent, {
      header: "Adicionar Produtos",
      width: '85vw',
      closable: true
    });
  }

  close() {
    this.dialog?.close();
  }

}
