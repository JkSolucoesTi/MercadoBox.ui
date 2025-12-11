import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { login } from 'src/app/model/login/login';
import { field } from 'src/app/util/formUtil';
import { LoginService } from './login.service';
import { LoginSignature } from 'src/app/model/Dto/signature/loginSignature';
import { ApiResponse } from 'src/app/model/apiResponse/apiResponse';
import { LoginResponse } from 'src/app/model/Dto/response/loginResponse';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from './auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    MessageModule,
    MessagesModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  login = new LoginSignature();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private notificacao: NotificacaoService,
    private authService:AuthServiceService,
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
      if(response.success === false){
          this.notificacao.error('Mensagem', response.message);        
        return;
      }
      this.authService.salvarToken(response.data.token);
       this.router.navigate(['/home']);
    },
    error: () => {
      this.notificacao.error('Mensagem', `Não foi possível realizar o login`);
    }
  });
}
}
