import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categoria } from 'src/app/model/categoria/categoria';
import { ProdutosService } from 'src/app/services/produtos.service';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { PanelComponent } from 'src/app/shared/panel/panel.component';
import { ProdutoCompleto } from 'src/app/model/produto/produtoCompleto';

@Component({
  selector: 'app-produtos-list',
 standalone: true,
  imports: [    
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    MenubarModule,
    TableModule,
    DropdownModule,
    CardModule,
    PanelModule,
    DividerModule,
    PanelComponent
  ],
  templateUrl: './produtos-list.component.html',
  styleUrls: ['./produtos-list.component.scss']
})
export class ProdutosListComponent {

    items: any[] = [];
  
    produtos: ProdutoCompleto[] = [];
  
    categorias: Categoria[] = [];  // Array para armazenar as categorias
    categoriaSelecionada: any;
  
    constructor(private produtosService: ProdutosService, private router:Router) {}
  
    ngOnInit() {
      this.listarProdutos();
  
      this.items = [
        { label: 'Início', icon: 'pi pi-home', routerLink: ['/'] },
        { label: 'Produtos', icon: 'pi pi-box', routerLink: ['/produtos'] },
        { label: 'Compras', icon: 'pi pi-tags', routerLink: ['/categorias'] },
      ];
  
  
    }
  
    listarProdutos() {
      this.produtosService.listar().subscribe((data) => {
      this.produtos = data;  
      this.listarCategoria();
      });
    }
  
    listarCategoria(){
      this.produtosService.getCategorias().subscribe((categorias) => {
        this.categorias = categorias; 
      });  
    }
   
  deletarProduto(id: number) {
    this.produtosService.deletar(id).subscribe(() => this.listarProdutos());
  }
  

  
  getNomeCategoria(id?: number) {
    const categoria = this.categorias.find(c => Number(c.id) === id)?.nome;
    return categoria;
  }

}
