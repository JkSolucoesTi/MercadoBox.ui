import { ProdutoResponse } from './../../../model/Dto/response/produtoResponse';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produtos-card',
  standalone: true,
  imports: [CommonModule,CardModule,ButtonModule],
  templateUrl: './produtos-card.component.html',
  styleUrls: ['./produtos-card.component.scss']
})
export class ProdutosCardComponent {
 
  constructor(private router : Router){}

  @Input()  produto! : ProdutoResponse

  @Output() abrirCodigo = new EventEmitter<string>();

  abrirModal() {
    if (this.produto?.codigo) {
      this.abrirCodigo.emit(this.produto.codigo);
    }
  }

   editar(id: number | undefined){
    this.router.navigate(['/produtos/editar/', id]);
 }

}
