import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CompraReponse } from 'src/app/model/Dto/response/compraResponse';
import { CompraService } from 'src/app/pages/compra/compra.service';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { PanelComponent } from 'src/app/shared/panel/panel.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MercadoService } from 'src/app/pages/mercados/mercado.service';
import { PaginatedResult } from 'src/app/model/Dto/response/paginacoResponse';
import { MercadoResponse } from 'src/app/model/Dto/response/mercadoResponse';
import { ApiResponse } from 'src/app/model/apiResponse/apiResponse';
import { PaginatorModule } from 'primeng/paginator';
import { SidebarModule } from 'primeng/sidebar';
import { PrimeNGConfig } from 'primeng/api';
import { CompraCardComponent } from '../compra-card/compra-card.component';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-compra-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BadgeModule,
    CardModule,
    ButtonModule,
    DividerModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
    PaginatorModule,
    PanelComponent,
    SidebarModule,
    CompraCardComponent
  ],
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.scss']
})
export class CompraListComponent {
  mercados: MercadoResponse[] = [];
  compras: CompraReponse[] = [];
  form: any;
  sidebarVisible = false;

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  paginaAtual: number = 1;



  constructor(
    private authService : AuthServiceService,
    private fb: FormBuilder, 
    private compraService: CompraService, 
    private notificacao: NotificacaoService, 
    private router: Router, 
    private mercadoService: MercadoService, 
    private primengConfig: PrimeNGConfig) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      mercadoId: [null, Validators.required],
      dataDe: [null, Validators.required],
      dataAte: [null, Validators.required]
    });
    this.obterMercados();   
    this.calendario();
  }

  obterCompras(): void {
    const f = this.form.value;
    var id_usuario = Number(this.authService.obterPayload()?.sub);

    this.compraService.listarCompraPaginado(this.paginaAtual,this.rows,f.mercadoId,f.dataDe,f.dataAte,id_usuario).subscribe({
      next: (response :PaginatedResult<CompraReponse>) => {
        if (response.itens.length > 0) {
          this.compras = response.itens;
          this.totalRecords = response.totalRegistros;
        } else {
          this.notificacao.info('Compras', 'Não existem compras neste periodo');
        }
        this.sidebarVisible = false;
      },
      error: (err: any) => {
        this.notificacao.error('Mensagem', "Não foi possível carregar a Lista de Compras");
      }
    });
  }

  obterMercados() {
    this.mercadoService.listar()
      .subscribe({
        next: (response: ApiResponse<MercadoResponse[]>) => {
          this.mercados = response.data;
        },
        error: () => {
          this.notificacao.error('Mensagem', `Não foi possível listar os produtos`);
        }
      });
  }

  limpar() {
    this.form.reset();
  }

  verDetalhes(guid: string | undefined): void {
    this.router.navigate(['/carrinho/' + guid]);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.paginaAtual = event.page + 1;
    this.obterCompras();
  }

  calendario(){
    this.primengConfig.setTranslation({
    dateFormat: 'dd/mm/yy',
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    monthNames: [
      'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
    ],
    monthNamesShort: [
      'Jan','Fev','Mar','Abr','Mai','Jun',
      'Jul','Ago','Set','Out','Nov','Dez'
    ],
    today: 'Hoje',
    clear: 'Limpar'
  });
  }
}
