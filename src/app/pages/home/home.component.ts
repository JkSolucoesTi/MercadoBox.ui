import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { Compra } from 'src/app/model/compra/compra';
import { CompraService } from 'src/app/services/compra.service';

@Component({
  selector: 'app-home',
  standalone:true,
  imports:[
    CommonModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    DividerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  compras: Compra[] = [];

  constructor(private compraService: CompraService) {}

  ngOnInit(): void {
    this.carregarComprasFinalizadas();
  }

  carregarComprasFinalizadas(): void {
    this.compraService.listarCompras().subscribe({
      next: (lista: Compra[]) => {
        this.compras = lista.filter(c => c.idmercado);
      },
      error: (err : any) => {
        console.error('Erro ao carregar compras', err);
      }
    });
  }

  verDetalhes(compra: Compra): void {
    console.log('Compra selecionada:', compra);
    // Aqui você pode navegar para uma rota de detalhes
    // this.router.navigate(['/compra', compra.id]);
  }

}
