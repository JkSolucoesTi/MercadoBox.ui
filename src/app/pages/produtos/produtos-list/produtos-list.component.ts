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
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { ToastModule } from 'primeng/toast';
import { BarcodeEan13Component } from 'src/app/shared/barcode-ean13/barcode-ean13.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatedResult } from 'src/app/model/Dto/response/paginacoResponse';
import { ProdutosCardComponent } from '../produtos-card/produtos-card.component';
import { DialogModule } from 'primeng/dialog';

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
    PanelComponent,
    ProdutosCardComponent,
    ToastModule,
    BarcodeEan13Component,
    AutoCompleteModule,    
    PaginatorModule,
    DialogModule
  ],
  templateUrl: './produtos-list.component.html',
  styleUrls: ['./produtos-list.component.scss']
})
export class ProdutosListComponent implements OnInit {

  items: any[] = [];
  header : string = "";
  produtos: ProdutoResponse[] = [];

  constructor(private produtosService: ProdutosService, private notificacao: NotificacaoService) { }

  ngOnInit() {
    this.carregarProdutos(1,10);
  }

  listarProdutos() {
    this.produtosService.listar().subscribe({
      next: (data) => {
        this.produtos = data;
        this.notificacao.info('Mensagem', 'Produtos carregados')
      }
      , error: (erro) => {
        this.notificacao.error('Mensagem', `Não foi possível listar os produtos :  ${erro.error}`);
      }
    }
    )
  }

  deletarProduto(id: number) {
    this.produtosService.deletar(id).subscribe(() => this.listarProdutos());
  }

  produtosFiltrados: any[] = [];
  produtoSelecionado: any;

  public openScanner() {

  }

  public onProdutoSelecionado(event: any) {

  }

  public search(event: any) {

  }

  /* paginação*/
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  paginaAtual: number = 1;

  onPageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
  this.paginaAtual = event.page + 1;
  this.carregarProdutos(this.paginaAtual, this.rows);
}

carregarProdutos(pagina: number, tamanhoPagina: number) {
  this.produtosService.listarProdutosPaginado(pagina,tamanhoPagina)
    .subscribe({
      next: (response: PaginatedResult<ProdutoResponse>) => {
        this.produtos = response.itens;
        this.totalRecords = response.totalRegistros;       
      },
      error: () =>{
         this.notificacao.error('Mensagem', `Não foi possível listar os produtos`);
      }
    });
}

modalCodigo = false;
codigoSelecionado = '';

abrirModalCodigo(codigo: string) {
  this.codigoSelecionado = codigo;
  this.modalCodigo = true;
  setTimeout(() => {}, 50);
}
}
