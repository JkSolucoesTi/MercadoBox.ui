import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from 'src/app/pages/login/auth-service.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone:true,
  templateUrl: './navbar.component.html',
  imports: [MenubarModule, RouterModule,CommonModule,ButtonModule],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(public auth: AuthServiceService,  private router: Router){}

  items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/home'
    },
    {
      label: 'Produtos',
      icon: 'pi pi-box',
      items: [
        { label: 'Lista de Produtos', icon: 'pi pi-list', routerLink: '/produtos' },
        { label: 'Cadastrar Produto', icon: 'pi pi-plus', routerLink: '/produtos/novo' }
      ]
    },
    {
      label: 'Mercados',
      icon: 'pi pi-shopping-cart',
      items: [
        { label: 'Lista de Mercados', icon: 'pi pi-list', routerLink: '/mercados' },
        { label: 'Cadastrar Mercado', icon: 'pi pi-plus', routerLink: '/mercados/novo' }
      ]
    },
    {
      label: 'Compras',
      icon: 'pi pi-wallet',
      items:[
         { label: 'Lista de Compras', icon: 'pi pi-list', routerLink: '/compras' },
        { label: 'Iniciar Compra', icon: 'pi pi-plus', routerLink: '/compras/novo' }
      ]
    }
  ];

    sair() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
