import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ProdutoResponse } from 'src/app/model/Dto/response/produtoResponse';

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
export class ProdutosListComponent implements OnInit {

    items: any[] = [];
  
    produtos: ProdutoResponse[] = [];
   
    constructor(private produtosService: ProdutosService) {}
  
    ngOnInit() {
      debugger;
      this.listarProdutos();  
  }
  
    listarProdutos() {
      this.produtosService.listar().subscribe({
        next : (data) =>{
          this.produtos = data;
        }
        ,error : (erro) =>{
          console.log("Não foi possível listar os produtos",erro);     
        }
      }
    )}
   
  deletarProduto(id: number) {
    this.produtosService.deletar(id).subscribe(() => this.listarProdutos());
  }
  
}
