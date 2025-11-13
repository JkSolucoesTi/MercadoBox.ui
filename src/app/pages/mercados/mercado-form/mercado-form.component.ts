import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MercadoService } from '../../../services/mercado.service';
import { CardModule } from 'primeng/card';
import { MercadoSignature } from 'src/app/model/Dto/signature/mercadoSignature';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-mercado-form',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    CardModule,
    ReactiveFormsModule],
  templateUrl: './mercado-form.component.html',
  styleUrls: ['./mercado-form.component.scss']
})
export class MercadoFormComponent implements OnInit {

  form!: FormGroup;
  mercado!: MercadoSignature
  id?: number;

  constructor(
    private fb: FormBuilder,
    private mercadoService: MercadoService,
    private notificacao: NotificacaoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      cnpj: ['', [Validators.required , Validators.maxLength(18) ]],
      telefone: ['', Validators.required],
      descricao: ['', Validators.required]
    })

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.mercadoService.buscarPorId(this.id).subscribe(dados => this.mercado = dados);
    }
  }

  salvarMercado() {
    
    this.mercado = this.form.value;
    if (this.mercado.id) {
      this.mercadoService.atualizar(this.mercado.id, this.mercado).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/mercados']);
            this.notificacao.success('Mercado', response.message)
          }else{
            this.notificacao.error('Mercado',response.message);
          }
        }
        , error: (erro) => {
          this.notificacao.error('Mensagem', `Não foi possível editar o mercado ${erro.error}`);
        }
      });
    } else {
      this.mercadoService.criar(this.mercado).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/mercados']);
            this.notificacao.success('Mercado', response.message);
          } else {
            this.notificacao.error('Mercado', response.message);
          }
        }
        , error: (erro) => {
          this.notificacao.error('Mensagem', `Não foi possível cadastrar o mercado ${erro.error}`);
        }
      });
    }
  }
}
