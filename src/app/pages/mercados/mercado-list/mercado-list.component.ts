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


@Component({
  selector: 'app-mercado-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule,CardModule,PanelComponent,DividerModule],
  templateUrl: './mercado-list.component.html',
  styleUrls: ['./mercado-list.component.scss']
})
export class MercadoListComponent implements OnInit{

  
  constructor(private mercadoService: MercadoService) {}

  mercados: MercadoResponse[] = [];
  
  ngOnInit(): void {
    this.carregarMercados();
  }

  carregarMercados() {
    this.mercadoService.listar()
    .subscribe({
      next : (dados) =>{
        this.mercados = dados
      },
      error : (erro) =>{
        console.log("Erro ao carregar mercados",erro);
      }
    });
  }

  deletarMercado(id: number) {
    this.mercadoService.deletar(id).subscribe(() => {
      this.carregarMercados(); // recarrega a lista após deletar
    });
  }
}
