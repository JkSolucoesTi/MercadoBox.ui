import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CompraReponse } from 'src/app/model/Dto/response/compraResponse';
import { CompraService } from 'src/app/services/compra.service';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { PanelComponent } from 'src/app/shared/panel/panel.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MercadoService } from 'src/app/services/mercado.service';
import { PaginatedResult } from 'src/app/model/Dto/response/paginacoResponse';
import { MercadoResponse } from 'src/app/model/Dto/response/mercadoResponse';
import { ApiResponse } from 'src/app/model/apiResponse/apiResponse';

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
    PanelComponent
  ],
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.scss']
})
export class CompraListComponent {
  mercados: MercadoResponse[] = [];
  compras: CompraReponse[] = [];
  form: any;


  constructor(private fb: FormBuilder, private compraService: CompraService, private notificacao: NotificacaoService, private router: Router, private mercadoService: MercadoService) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      mercadoId: [null, Validators.required],
      dataDe: [new Date(), Validators.required],
      dataAte: [new Date(), Validators.required]
    });
    this.obterMercados();
    this.carregarComprasFinalizadas();

  }

  carregarComprasFinalizadas(): void {
    this.compraService.listarCompras().subscribe({
      next: (response) => {
        if (response.success) {
          this.compras = response.data;
          this.notificacao.success('Compras', response.message);
        } else {
          this.notificacao.success('Compras', response.message);
        }
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

  buscar() {
    console.log(this.form);
  }

  limpar() {
    this.form.reset();
  }

  verDetalhes(guid: string | undefined): void {
    this.router.navigate(['/carrinho/' + guid]);
  }
}
