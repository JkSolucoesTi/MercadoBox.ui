import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/loader/loader.component';

@NgModule({
  imports: [   
    RouterOutlet,
    BrowserAnimationsModule   
  ],
  declarations: [                       
  ]
})
export class AppModule { }
