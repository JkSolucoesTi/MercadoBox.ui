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

export const routes: Routes = [
   { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path:'home',component:HomeComponent},
  { path: 'produtos', component: ProdutosListComponent },
  { path: 'produtos/novo', component: ProdutosFormComponent },
  { path: 'produtos/editar/:id', component: ProdutosFormComponent },
  { path: 'mercados', component: MercadoListComponent },
  { path: 'mercados/novo', component: MercadoFormComponent },
  { path: 'mercados/editar/:id', component: MercadoFormComponent },
  { path :'carrinho/:id',component:CarrinhoFormComponent},
  {path:'compras/novo',component:CompraFormComponent},
  {path:'compras',component:CompraListComponent},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
