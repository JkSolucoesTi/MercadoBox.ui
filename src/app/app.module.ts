import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarcodeScannerComponent } from './shared/barcode-scanner/barcode-scanner.component';

@NgModule({
  imports: [   
    RouterOutlet,
    BrowserAnimationsModule   
  ],
  declarations: [                 
  
    BarcodeScannerComponent
  ]
})
export class AppModule { }
