import { ItemCarrinho } from './../../model/carrinho/itemCarrinho';
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
import { CompraService } from 'src/app/services/compra.service';
import { Compra } from 'src/app/model/compra/compra';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CompraReponse } from 'src/app/model/Dto/response/compraResponse';
import { CompraTokenSignature } from 'src/app/model/Dto/signature/compraTokenSignature';
import { CarrinhoStoreService } from 'src/app/services/carrinho-store.service';

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

  compraToken: CompraTokenSignature = new CompraTokenSignature();
  compraResponse: CompraReponse = new CompraReponse();
  private subscription: Subscription = new Subscription();

  constructor(
    private compraService: CompraService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private carrinhoService : CarrinhoStoreService
  ) { }

  ngOnInit(): void {

    this.subscription.add(
      this.activatedRoute.paramMap.subscribe(params =>{
        const guid = params.get('id');
        if(guid){
          this.carrinhoService.setCompraGuid(guid);
          this.compraToken.Guid = guid;
        }
      })
    )

    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          if (!event.url.startsWith('/carrinho')) {
            this.carrinhoService.clearCompraGuid();
            this.compraToken.Guid = '';
          }
        })
    );

    this.compraService.buscarPorId(this.compraToken).subscribe(x => {
      this.compraResponse = x     
    });
  }

  salvar() {
    // this.compraService.finalizar(this.compra).subscribe(x => {
    // })
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
