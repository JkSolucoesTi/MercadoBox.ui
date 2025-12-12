import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ButtonModule } from 'primeng/button';
import { Role } from 'src/app/model/enums/role.enum';

@Component({
  selector: 'app-navbar',
  standalone:true,
  templateUrl: './navbar.component.html',
  imports: [MenubarModule, RouterModule,CommonModule,ButtonModule],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  items: any[] = [];

  constructor(public auth: AuthServiceService,  private router: Router)
  {
    this.carregarMenu();
  }

  carregarMenu() {
  this.items = [
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
        this.temPermissao(Role.ADMIN) ? 
        { label: 'Cadastrar Produto', icon: 'pi pi-plus', routerLink: '/produtos/novo' } 
        : null
      ].filter(i => i !== null)
    },

    {
      label: 'Mercados',
      icon: 'pi pi-shopping-cart',
      items: [
        { label: 'Lista de Mercados', icon: 'pi pi-list', routerLink: '/mercados' },
        this.temPermissao(Role.ADMIN) ?
        { label: 'Cadastrar Mercado', icon: 'pi pi-plus', routerLink: '/mercados/novo' }
        : null
      ].filter(i => i !== null)
    },

    {
      label: 'Compras',
      icon: 'pi pi-wallet',
      items: [
        { label: 'Lista de Compras', icon: 'pi pi-list', routerLink: '/compras' },
        { label: 'Iniciar Compra', icon: 'pi pi-plus', routerLink: '/compras/novo' }
      ]
    }
  ];
}

  temPermissao(permissao: string): boolean {
    return this.auth.possuiPermissao(permissao);
  }
    sair() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
