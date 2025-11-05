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
    PanelComponent
  ],
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.scss']
})
export class CompraListComponent {
 compras: CompraReponse[] = [];

  constructor(private compraService: CompraService, private notificacao: NotificacaoService, private router: Router) {
  }

  ngOnInit(): void {
    this.carregarComprasFinalizadas();
  }

  carregarComprasFinalizadas(): void {
    this.compraService.listarCompras().subscribe({
      next: (response) => {
        if (response.success) {
          this.compras = response.data;
          this.notificacao.success('Compras', response.message);
        }else{
          this.notificacao.success('Compras', response.message);
        }
      },
      error: (err: any) => {
        this.notificacao.error('Mensagem', "Não foi possível carregar a Lista de Compras");
      }
    });
  }

  verDetalhes(guid: string | undefined): void {
    this.router.navigate(['/carrinho/' + guid]);
  }
}
