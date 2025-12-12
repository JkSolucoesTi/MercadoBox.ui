import { Permissao } from './model/login/permissao';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MercadoListComponent } from './pages/mercados/mercado-list/mercado-list.component';
import { MercadoFormComponent } from './pages/mercados/mercado-form/mercado-form.component';
import { CompraFormComponent } from './pages/compra/compra-form/compra-form.component';
import { CarrinhoFormComponent } from './pages/carrinho-form/carrinho-form.component';
import { ProdutosFormComponent } from './pages/produtos/produtos-form/produtos-form.component';
import { ProdutosListComponent } from './pages/produtos/produtos-list/produtos-list.component';
import { HomeComponent } from './pages/home/home.component';
import { CompraListComponent } from './pages/compra/compra-list/compra-list.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from '../app/core/guards/auth.guard';
import { Role } from './model/enums/role.enum';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'produtos', component: ProdutosListComponent, canActivate: [AuthGuard] },
  {
    path: 'produtos/novo', component: ProdutosFormComponent, canActivate: [AuthGuard], data: { permissoes: [Role.ADMIN] }},
  { path: 'produtos/editar/:id', component: ProdutosFormComponent, canActivate: [AuthGuard] ,data: { permissoes: [Role.ADMIN] }},

  { path: 'mercados', component: MercadoListComponent, canActivate: [AuthGuard] },
  { path: 'mercados/novo', component: MercadoFormComponent, canActivate: [AuthGuard] ,data: { permissoes: [Role.ADMIN] } },
  { path: 'mercados/editar/:id', component: MercadoFormComponent, canActivate: [AuthGuard] ,data: { permissoes: [Role.ADMIN] }},

  { path: 'carrinho/:id', component: CarrinhoFormComponent, canActivate: [AuthGuard] },

  { path: 'compras', component: CompraListComponent, canActivate: [AuthGuard] },
  { path: 'compras/novo', component: CompraFormComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
