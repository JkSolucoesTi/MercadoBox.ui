import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro.component';

@NgModule({
  imports: [   
    RouterOutlet,
    BrowserAnimationsModule   
  ],
  declarations: [                                  
  ]
})
export class AppModule { }
