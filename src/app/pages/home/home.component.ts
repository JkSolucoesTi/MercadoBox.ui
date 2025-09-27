import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CompraService } from 'src/app/services/compra.service';
import { CompraReponse } from 'src/app/model/Dto/response/compraResponse';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    DividerModule,

  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  compras: CompraReponse[] = [];

  constructor(private compraService: CompraService, private notificacao: NotificacaoService, private router: Router) {
  }

  ngOnInit(): void {
    this.carregarComprasFinalizadas();
  }

  carregarComprasFinalizadas(): void {
    this.compraService.listarCompras().subscribe({
      next: (lista) => {
        this.compras = lista;
        this.notificacao.success('Mensagem', 'Lista de Compras carregada');
      },
      error: (err: any) => {
        this.notificacao.error('Mensagem', 'Não foi possível carregar a Lista de Compras : ' + err.error);
      }
    });
  }

  verDetalhes(guid: string): void {
    this.router.navigate(['/carrinho/' + guid]);
  }

}
