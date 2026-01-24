import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
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
    DividerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

   menus = [
  {
    nome: 'Compras',
    rota: '/compras',
    icone: 'pi pi-wallet',
    descricao: 'Monte seu carrinho e acompanhe em tempo real o total da sua compra.'
  },
  {
    nome: 'Produtos',
    rota: '/produtos',
    icone: 'pi pi-box',
    descricao: 'Pesquise produtos pelo nome ou utilize o código de barras.'
  },
  {
    nome: 'Mercados',
    rota: '/mercados',
    icone: 'pi pi-shopping-cart',
    descricao: 'Encontre mercados próximos e navegue pelo Google Maps.'
  }
];

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

}
