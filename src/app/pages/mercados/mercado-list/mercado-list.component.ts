import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MercadoService } from '../mercado.service';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelComponent } from 'src/app/shared/panel/panel.component';
import { MercadoResponse } from 'src/app/model/Dto/response/mercadoResponse';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { MercadoCardComponent } from '../mercado-card/mercado-card.component';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatedResult } from 'src/app/model/Dto/response/paginacoResponse';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from 'src/app/core/services/location.service';
import { LocationStatus } from 'src/app/model/user/user-location.model';
import { MercadoProximo } from 'src/app/model/mercado/mercado-proximo.model';
import { Subscription } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

export type AbaAtiva = 'meus' | 'proximos';

@Component({
  selector: 'app-mercado-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    CardModule,
    PanelComponent,
    DividerModule,
    MercadoCardComponent,
    PaginatorModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  templateUrl: './mercado-list.component.html',
  styleUrls: ['./mercado-list.component.scss']
})
export class MercadoListComponent implements OnInit, OnDestroy {

  // ─── Aba ───────────────────────────────────────────────────────────────────
  abaAtiva: AbaAtiva = 'meus';

  // ─── Meus Mercados ─────────────────────────────────────────────────────────
  form!: FormGroup;
  mercados: MercadoResponse[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  paginaAtual: number = 1;

  // ─── Mercados Próximos ─────────────────────────────────────────────────────
  mercadosProximos: MercadoProximo[] = [];
  carregandoProximos = false;
  erroBuscaProximos = false;
  raioMetros = 3000;
  readonly raioOpcoes = [
    { label: '1 km', value: 1000 },
    { label: '3 km', value: 3000 },
    { label: '5 km', value: 5000 },
  ];

  // ─── Localização ───────────────────────────────────────────────────────────
  readonly LocationStatus = LocationStatus;
  private locationSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private mercadoService: MercadoService,
    private notificacao: NotificacaoService,
    public locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.carregarMercados(1, 10, '');

    this.form = this.fb.group({
      pesquisa: [''],
    });

    // Quando a localização mudar e estivermos na aba proximos, re-busca automaticamente
    this.locationSub = this.locationService.currentLocation$.subscribe(loc => {
      if (loc && this.abaAtiva === 'proximos') {
        this.buscarProximos();
      }
    });
  }

  ngOnDestroy(): void {
    this.locationSub?.unsubscribe();
  }

  // ─── Abas ──────────────────────────────────────────────────────────────────
  selecionarAba(aba: AbaAtiva): void {
    this.abaAtiva = aba;
    if (aba === 'proximos') {
      const status = this.locationService.getCurrentStatusValue();
      if (status === LocationStatus.IDENTIFIED) {
        this.buscarProximos();
      }
    }
  }

  // ─── Mercados Próximos ─────────────────────────────────────────────────────
  buscarProximos(): void {
    const loc = this.locationService.getCurrentLocationValue();
    if (!loc) return;

    this.carregandoProximos = true;
    this.erroBuscaProximos = false;
    this.mercadosProximos = [];

    this.mercadoService.obterMercadosProximos(loc.latitude, loc.longitude, this.raioMetros)
      .subscribe({
        next: (response) => {
          this.mercadosProximos = response.data ?? [];
          this.carregandoProximos = false;
        },
        error: () => {
          this.erroBuscaProximos = true;
          this.carregandoProximos = false;
          this.notificacao.error('Mercados Próximos', 'Não foi possível buscar mercados próximos. Tente novamente.');
        }
      });
  }

  mudarRaio(raio: number): void {
    this.raioMetros = raio;
    const status = this.locationService.getCurrentStatusValue();
    if (status === LocationStatus.IDENTIFIED) {
      this.buscarProximos();
    }
  }

  solicitarLocalizacao(): void {
    this.locationService.openConsentPrompt();
  }

  atualizarLocalizacao(): void {
    this.locationService.requestLocation(true);
  }

  googleMapsUrlProximo(mercado: MercadoProximo): string {
    return `https://www.google.com/maps/search/?api=1&query=${mercado.latitude},${mercado.longitude}`;
  }

  // ─── Meus Mercados ─────────────────────────────────────────────────────────
  carregarMercados(page: number, pageSize: number, filtro: string) {
    this.mercadoService.listarMercadoPaginado(page, pageSize, filtro)
      .subscribe({
        next: (response: PaginatedResult<MercadoResponse>) => {
          this.mercados = response.itens;
          this.totalRecords = response.totalRegistros;
        },
        error: () => {
          this.notificacao.error('Mensagem', `Não foi possível listar os mercados`);
        }
      });
  }

  deletarMercado(id: number) {
    this.mercadoService.desativar(id).subscribe(() => {});
  }

  pesquisar() {
    const valor = this.form.get('pesquisa')?.value;
    this.carregarMercados(this.paginaAtual, this.rows, valor);
  }

  limparPesquisa() {
    this.form.get('pesquisa')?.setValue('');
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.paginaAtual = event.page + 1;
    this.carregarMercados(this.paginaAtual, this.rows, '');
  }
}
