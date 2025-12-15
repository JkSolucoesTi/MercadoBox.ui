import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompraCardComponent } from './pages/compra/compra-card/compra-card.component';

@NgModule({
  imports: [   
    RouterOutlet,
    BrowserAnimationsModule   
  ],
  declarations: [                          
  ]
})
export class AppModule { }
