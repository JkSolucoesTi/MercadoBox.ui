import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-cadastro',
  standalone:true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    InputMaskModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    cpf: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Aqui você pode chamar seu service para salvar no JSON Server
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

}
