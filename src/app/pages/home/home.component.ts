import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CompraService } from 'src/app/services/compra.service';
import { CompraReponse } from 'src/app/model/Dto/response/compraResponse';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BadgeModule,
    CardModule,
    ButtonModule,
    DividerModule,

  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

    menus = [
    { nome: 'Compras', rota: '/compras', icone: 'pi pi-wallet' },
    { nome: 'Produtos', rota: '/produtos', icone: 'pi pi-box' },
    { nome: 'Mercados', rota: '/mercados', icone: 'pi pi-shopping-cart' }
  ];

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

}
