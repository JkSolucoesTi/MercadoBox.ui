import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

import { CadastroService } from './cadastro.service';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { UsuarioSignature } from 'src/app/model/Dto/signature/usuarioSignature';
import { ApiResponse } from 'src/app/model/apiResponse/apiResponse';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    RouterModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  loading = false;
  erroMensagem: string = '';

  registerForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.senhasIguaisValidator });

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroService,
    private notificacao: NotificacaoService,
    private router: Router
  ) {}

  senhasIguaisValidator(group: any) {
    const senha = group.get('password')?.value;
    const confirma = group.get('confirmPassword')?.value;
    return senha === confirma ? null : { senhasDiferentes: true };
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.erroMensagem = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const signature: UsuarioSignature = {
      nome: this.f['nome'].value ?? '',
      email: this.f['email'].value ?? '',
      password: this.f['password'].value ?? ''
    };

    this.cadastroService.cadastrar(signature).subscribe({
      next: (response: ApiResponse<boolean>) => {
        this.loading = false;
        if (response.success) {
          this.notificacao.success('Cadastro realizado!', 'Sua conta foi criada com sucesso. Faça login para continuar.');
          this.router.navigate(['/login']);
        } else {
          this.erroMensagem = response.message;
        }
      },
      error: () => {
        this.loading = false;
        this.erroMensagem = 'Não foi possível realizar o cadastro. Tente novamente.';
      }
    });
  }
}
