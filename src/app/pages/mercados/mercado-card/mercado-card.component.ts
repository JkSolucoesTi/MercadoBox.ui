import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MercadoResponse } from 'src/app/model/Dto/response/mercadoResponse';

@Component({
  selector: 'app-mercado-card',
  standalone:true,
  imports:[
    CardModule,
    ButtonModule
  ],
  templateUrl: './mercado-card.component.html',
  styleUrls: ['./mercado-card.component.scss']
})
export class MercadoCardComponent {

  constructor(private router: Router){}

  @Input() mercado!: MercadoResponse

    get googleMapsUrl(): string {
    const endereco = `${this.mercado.nome} ${this.mercado.endereco}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
  }

 editar(id: number | undefined){
  debugger;
    this.router.navigate(['/mercados/editar/', id]);
 }
}
