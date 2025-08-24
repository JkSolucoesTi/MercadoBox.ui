import { ItemCarrinho } from './../../model/carrinho/itemCarrinho';
import { StorageService } from './../../services/storage.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { CompraService } from 'src/app/services/compra.service';
import { Compra } from 'src/app/model/compra/compra';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarrinhoStoreService } from 'src/app/services/carrinho-store.service';
import { StatusE } from 'src/app/model/enum/statusE';

export interface Product {
  id: number;
  codigo: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-carrinho-form',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    CardModule,
    DividerModule,
    PanelComponent
  ],
  templateUrl: './carrinho-form.component.html',
  styleUrls: ['./carrinho-form.component.scss']
})
export class CarrinhoFormComponent implements OnInit {


  compra!: Compra;
  subscription: Subscription = new Subscription();

  constructor(private eventeEmitter: EventEmitterService,
    private compraService: CompraService,
    
    private carrinhoStorageService : CarrinhoStoreService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.compraService.buscarPorId(String(id)).subscribe(x => {
      this.compra = x
    });

     this.carrinhoStorageService.getCompra$().subscribe(compraStore => {
        if (compraStore && compraStore.itens) {
         this.compra.itens = compraStore.itens;
         this.compraService.atualizar(this.compra).subscribe(result => {
          console.log(result);
         })
       }
    });

  }

  salvar() {
    this.compra.status = StatusE.Concluido
    this.compraService.finalizar(this.compra).subscribe(x => {
      
    })
  }

calcularTotal(compra: Compra): number {
  return compra.itens?.reduce(
    (soma, item) => soma + Number(item.preco) * Number(item.quantidade),
    0
  ) ?? 0;
}



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
