import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { BarcodeFormat } from '@zxing/library';
import { CompraService } from 'src/app/services/compra.service';
import { CompraReponse } from 'src/app/model/Dto/response/compraResponse';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    DividerModule,
    ZXingScannerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  compras: CompraReponse[] = [];

  /*TESTE DE CAMERA*/

  allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE
  ];
  currentDevice: MediaDeviceInfo | undefined;
  availableDevices: MediaDeviceInfo[] = [];
  hasDevices = false;
  hasPermission = false;
  scannedResult: string | null = null;

  constructor(private compraService: CompraService, private notificacao: NotificacaoService, private router: Router) {

  }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }

  onScanSuccess(result: string) {
    this.scannedResult = result;
    console.log('Código lido:', result);
  }
  onPermissionResponse(result: boolean) {
    this.hasPermission = result;
  }

  onScanFailure() {
    console.log('⛔ Tentativa de leitura falhou');
  }

  ngOnInit(): void {
    this.carregarComprasFinalizadas();

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.availableDevices = devices.filter(d => d.kind === 'videoinput');
      if (this.availableDevices.length > 0) {
        this.currentDevice = this.availableDevices[0]; // pega a primeira câmera
      }
    });
  }

  carregarComprasFinalizadas(): void {
    this.compraService.listarCompras().subscribe({
      next: (lista) => {
        this.compras = lista;
        this.notificacao.success('Mensagem', 'Lista de Compras carregada');
      },
      error: (err: any) => {
        this.notificacao.error('Mensagem', 'Não foi possível carregar a Lista de Compras : ' + err.error);
      }
    });
  }

  verDetalhes(guid: string): void {
    this.router.navigate(['/carrinho/' + guid]);
  }

}
