import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { field } from 'src/app/util/formUtil';
import { LoginService } from './login.service';
import { LoginSignature } from 'src/app/model/Dto/signature/loginSignature';
import { ApiResponse } from 'src/app/model/apiResponse/apiResponse';
import { LoginResponse } from 'src/app/model/Dto/response/loginResponse';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  login = new LoginSignature();
  erroLogin: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private authService: AuthServiceService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }
  ngOnInit(): void {
    this.authService.logout();
  }

  logar() {
    debugger;
    if (this.form.invalid) return;

    this.login.email = field(this.form, "email").value;
    this.login.password = field(this.form, "password").value;

    this.loginService.login(this.login).subscribe({
      next: (response: ApiResponse<LoginResponse>) => {
        if (response.success === false) {
              this.erroLogin = response.message;   // <-- AQUI
              return;
        } else {
          this.authService.salvarToken(response.data.token);
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.erroLogin = 'Não foi possível realizar o login';
      }
    });
  }
}
