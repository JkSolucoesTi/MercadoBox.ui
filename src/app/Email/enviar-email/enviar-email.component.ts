import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Pessoa } from './dto/pessoa';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-enviar-email',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FileUploadModule,
    TableModule,
    ButtonModule,
    CardModule,
    DividerModule,
    ToolbarModule,
    DialogModule
  ],
  templateUrl: './enviar-email.component.html',
  styleUrls: ['./enviar-email.component.scss']
})
export class EnviarEmailComponent {

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  pessoas: Pessoa[] = [];
  loading = false;
  show = false;
  Message = '';

  constructor(private http: HttpClient) { }

  onFileSelect(event: any) {
    const file = event.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.loading = true;

    this.http.post<Pessoa[]>('https://localhost:7054/api/Cadastro/UploadCsv', formData)
      .subscribe({
        next: res => {
          this.pessoas = res;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.Message = 'Erro ao importar arquivo.';
          this.show = true;
          this.fileUpload.clear();
        }
      });
  }

  enviarEmails() {
    if (!this.pessoas.length) return;
    this.loading = true;
    this.http
      .post('https://localhost:7054/api/Cadastro/EnviarEmail', this.pessoas)
      .subscribe({
        next: (res : any) => {
          this.pessoas = res;
          this.show = true;
           this.loading = false;
          this.Message = 'Envio realizado!';
        },
        error: err => {
          this.show = true;
          this.loading = false;
          this.Message = err.error;
          this.fileUpload.clear();
        }
      });
  }

}
