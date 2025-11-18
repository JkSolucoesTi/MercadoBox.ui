import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Mercado, MercadoService } from '../../../services/mercado.service';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelComponent } from 'src/app/shared/panel/panel.component';
import { MercadoResponse } from 'src/app/model/Dto/response/mercadoResponse';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { MercadoCardComponent } from '../mercado-card/mercado-card.component';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatedResult } from 'src/app/model/Dto/response/paginacoResponse';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-mercado-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule, CardModule, PanelComponent, DividerModule,MercadoCardComponent , PaginatorModule , ReactiveFormsModule],
  templateUrl: './mercado-list.component.html',
  styleUrls: ['./mercado-list.component.scss']
})
export class MercadoListComponent implements OnInit {


  constructor(private fb: FormBuilder,private mercadoService: MercadoService, private notificacao: NotificacaoService) { }

  form!: FormGroup;
  mercados: MercadoResponse[] = [];

  ngOnInit(): void {
    this.carregarMercados(1,10,'');

    this.form = this.fb.group({
      pesquisa: [''],
    });

  }

  carregarMercados(page : number,pageSize : number,filtro : string) {
    debugger;
    this.mercadoService.listarMercadoPaginado(page,pageSize,filtro)
      .subscribe({
              next: (response: PaginatedResult<MercadoResponse>) => {
                this.mercados = response.itens;
                this.totalRecords = response.totalRegistros;
              },
              error: () => {
                this.notificacao.error('Mensagem', `Não foi possível listar os produtos`);
              }
            });
  }

  deletarMercado(id: number) {
    this.mercadoService.deletar(id).subscribe(() => {
    });
  }

  pesquisar()
  {
    var valor = this.form.get('pesquisa')?.value;
    this.carregarMercados(this.paginaAtual, this.rows, valor);
  }

  limparPesquisa() {
  this.form.get('pesquisa')?.setValue('');
  }
/*Paginação*/

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  paginaAtual: number = 1;

  onPageChange(event : any)
  {     
    this.first = event.first;
    this.rows = event.rows;
    this.paginaAtual = event.page + 1;
    this.carregarMercados(this.paginaAtual, this.rows, '');
  }
}
