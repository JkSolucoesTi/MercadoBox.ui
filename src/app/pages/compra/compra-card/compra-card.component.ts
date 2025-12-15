import { Component, Input } from '@angular/core';
import { CompraReponse } from 'src/app/model/Dto/response/compraResponse';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-compra-card',
  standalone:true,
  imports:[
    CommonModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './compra-card.component.html',
  styleUrls: ['./compra-card.component.scss']
})
export class CompraCardComponent {

  @Input() compras: CompraReponse[]=[];

  constructor(private router : Router) {    
  }
    
  verDetalhes(guid: string | undefined): void {
    this.router.navigate(['/carrinho/' + guid]);
  }


}
