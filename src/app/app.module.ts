import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MercadoCardComponent } from './pages/mercados/mercado-card/mercado-card.component';

@NgModule({
  imports: [   
    RouterOutlet,
    BrowserAnimationsModule   
  ],
  declarations: [                         
  
    MercadoCardComponent
  ]
})
export class AppModule { }
