import { ProdutoResponse } from './../../../model/Dto/response/produtoResponse';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-produtos-card',
  standalone: true,
  imports: [CommonModule,CardModule],
  templateUrl: './produtos-card.component.html',
  styleUrls: ['./produtos-card.component.scss']
})
export class ProdutosCardComponent {
 
  @Input()  produto! : ProdutoResponse

  @Output() abrirCodigo = new EventEmitter<string>();

  abrirModal() {
    if (this.produto?.codigo) {
      this.abrirCodigo.emit(this.produto.codigo);
    }
  }

}
