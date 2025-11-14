import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as JsBarcode from 'jsbarcode';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-barcode-ean13',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './barcode-ean13.component.html',
  styleUrls: ['./barcode-ean13.component.scss']
})
export class BarcodeEan13Component implements AfterViewInit {
  @Input() codigo?: string;
  @ViewChild('barcodeCanvas', { static: false }) barcodeCanvas!: ElementRef<HTMLCanvasElement>;
  mostrar = false;

  ngAfterViewInit() {
    // Só gera o código automaticamente se quiser, aqui deixamos no botão
  }

  ngOnChanges() {
    debugger;
    if (this.codigo) {
      this.gerarCodigo();
    }
  }

  gerarCodigo() {
    if (!this.codigo) return;

    this.mostrar = true;

    setTimeout(() => {
      if (this.barcodeCanvas?.nativeElement) {
        JsBarcode(this.barcodeCanvas.nativeElement, this.codigo!, {
          format: 'EAN13',
          displayValue: true,
          width: 2,
          height: 80,
          fontSize: 16
        });
      }
    });
  }
}
