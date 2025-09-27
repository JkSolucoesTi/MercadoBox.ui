import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, ButtonModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent {

  scannerEnabled = true;
  allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE
  ];
  availableDevices: MediaDeviceInfo[] = [];
  hasPermission = false;
  scannedResult: string | null = null;

  @Output() scanned = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  onScanSuccess(result: string) {
    this.scanned.emit(result);
  }

  onClose() {
    this.close.emit();
  }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }

  onPermissionResponse(result: boolean) {
    this.hasPermission = result;
  }

  onScanFailure() {
    console.log('⛔ Tentativa de leitura falhou');
  }

}
