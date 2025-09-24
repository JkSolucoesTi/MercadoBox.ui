import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone:true,
  templateUrl: './navbar.component.html',
  imports: [MenubarModule, RouterModule,CommonModule],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/home'
    },
    {
      label: 'Produtos',
      icon: 'pi pi-shopping-cart',
      items: [
        { label: 'Lista de Produtos', icon: 'pi pi-list', routerLink: '/produtos' },
        { label: 'Cadastrar Produto', icon: 'pi pi-plus', routerLink: '/produtos/novo' }
      ]
    },
    {
      label: 'Mercados',
      icon: 'pi pi-store',
      items: [
        { label: 'Lista de Mercados', icon: 'pi pi-list', routerLink: '/mercados' },
        { label: 'Cadastrar Mercado', icon: 'pi pi-plus', routerLink: '/mercados/novo' }
      ]
    },
    {
      label: 'Compras',
      icon: 'pi pi-wallet',
      routerLink: '/compras'
    }
  ];

}
