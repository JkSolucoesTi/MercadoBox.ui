import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompraListComponent } from './pages/compra/compra-list/compra-list.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  imports: [   
    RouterOutlet,
    BrowserAnimationsModule   
  ],
  declarations: [                 
  ]
})
export class AppModule { }
