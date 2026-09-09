import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { CompraService } from '../../compra/compra.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CompraSignature } from 'src/app/model/Dto/signature/compraSignature';

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
  salvandoMercadoId: number | null = null;
  mercadosSalvosIds = new Set<string>(); // para feedback imediato por Nome+Endereco
  iniciandoCompraId: number | null = null;

  readonly raioOpcoes = [
    { label: '1 km', value: 1000 },
    { label: '3 km', value: 3000 },
    { label: '5 km', value: 5000 },
    { label: '10 km', value: 10000 },
    { label: '15 km', value: 15000 },
    { label: '30 km', value: 30000 },
  ];

  // ─── Localização ───────────────────────────────────────────────────────────
  readonly LocationStatus = LocationStatus;
  private locationSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private mercadoService: MercadoService,
    private notificacao: NotificacaoService,
    private compraService: CompraService,
    private authService: AuthServiceService,
    private router: Router,
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
  buscarProximos(forceRefresh = false): void {
    const loc = this.locationService.getCurrentLocationValue();
    if (!loc) return;

    this.carregandoProximos = true;
    this.erroBuscaProximos = false;
    this.mercadosProximos = [];

    this.mercadoService.obterMercadosProximos(loc.latitude, loc.longitude, this.raioMetros, forceRefresh)
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

  obterLogoMercado(nomeMercado: string): string {
    const nome = (nomeMercado || '').toLowerCase();
    if (nome.includes('chama')) {
      return 'assets/chama_supermercados.png';
    }
    if (nome.includes('carrefour')) {
      return 'assets/carrefour.png';
    }
    return 'assets/carrefour.png';
  }

  formatarDistancia(mercado: MercadoProximo): string {
    if (mercado.distanciaKm !== undefined && mercado.distanciaKm !== null) {
      if (mercado.distanciaKm < 1.0) {
        return `${Math.round(mercado.distanciaKm * 1000)} m`;
      }
      return `${mercado.distanciaKm.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
    }
    return mercado.distanciaFormatada || '';
  }

  obterChaveMercado(mercado: MercadoProximo): string {
    return `${mercado.nome?.trim().toLowerCase()}_${mercado.endereco?.trim().toLowerCase() || ''}`;
  }

  isMercadoSalvo(mercado: MercadoProximo): boolean {
    const chave = this.obterChaveMercado(mercado);
    if (this.mercadosSalvosIds.has(chave)) return true;

    return this.mercados.some(m =>
      m.nome?.trim().toLowerCase() === mercado.nome?.trim().toLowerCase()
    );
  }

  salvarMercadoProximo(mercado: MercadoProximo): void {
    this.salvandoMercadoId = Number(mercado.id);

    const payload = {
      nome: mercado.nome,
      endereco: mercado.endereco || '',
      cidade: '',
      estado: '',
      cnpj: '',
      telefone: '',
      ativo: true
    };

    this.mercadoService.obterOuCriar(payload).subscribe({
      next: (response) => {
        this.salvandoMercadoId = null;
        if (response.success && response.data) {
          this.mercadosSalvosIds.add(this.obterChaveMercado(mercado));
          this.notificacao.success('Mercado Salvo', `${mercado.nome} foi adicionado aos seus mercados.`);
          this.carregarMercados(1, this.rows, '');
        } else {
          this.notificacao.error('Mercado', response.message || 'Erro ao salvar mercado.');
        }
      },
      error: () => {
        this.salvandoMercadoId = null;
        this.notificacao.error('Mercado', 'Não foi possível salvar o mercado.');
      }
    });
  }

  iniciarCompraComMercado(mercado: MercadoProximo): void {
    this.iniciandoCompraId = Number(mercado.id);

    const payload = {
      nome: mercado.nome,
      endereco: mercado.endereco || '',
      cidade: '',
      estado: '',
      cnpj: '',
      telefone: '',
      ativo: true
    };

    // Garante que o mercado existe no banco antes de abrir a compra
    this.mercadoService.obterOuCriar(payload).subscribe({
      next: (respMercado) => {
        if (!respMercado.success || !respMercado.data) {
          this.iniciandoCompraId = null;
          this.notificacao.error('Compra', 'Erro ao vincular mercado para a compra.');
          return;
        }

        const mercadoId = respMercado.data.id;
        const idUsuario = Number(this.authService.obterPayload()?.sub);

        const compra: CompraSignature = {
          id: 0,
          mercadoId: mercadoId,
          data: new Date().toISOString(),
          itens: [],
          idUsuario: idUsuario,
          Create: function() { return this; },
          adicionarItem: function() {},
          adicionarItens: function() {}
        };

        this.compraService.criarCompra(compra).subscribe({
          next: (respCompra) => {
            this.iniciandoCompraId = null;
            if (respCompra.success && respCompra.data) {
              this.notificacao.success('Compra Iniciada', `Compra aberta no ${mercado.nome}!`);
              this.router.navigate(['/carrinho/' + respCompra.data.guid]);
            } else {
              this.notificacao.error('Compra', respCompra.message || 'Erro ao iniciar compra.');
            }
          },
          error: () => {
            this.iniciandoCompraId = null;
            this.notificacao.error('Compra', 'Não foi possível iniciar a compra.');
          }
        });
      },
      error: () => {
        this.iniciandoCompraId = null;
        this.notificacao.error('Compra', 'Erro ao obter dados do mercado.');
      }
    });
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

