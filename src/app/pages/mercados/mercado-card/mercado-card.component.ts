import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MercadoResponse } from 'src/app/model/Dto/response/mercadoResponse';

@Component({
  selector: 'app-mercado-card',
  standalone:true,
  imports:[
    CardModule
  ],
  templateUrl: './mercado-card.component.html',
  styleUrls: ['./mercado-card.component.scss']
})
export class MercadoCardComponent {

  @Input() mercado!: MercadoResponse

    get googleMapsUrl(): string {
    const endereco = `${this.mercado.nome} ${this.mercado.endereco}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
  }
}
