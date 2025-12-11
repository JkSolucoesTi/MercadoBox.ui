import { LoaderService } from './shared/loader/loader.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig} from 'primeng/api'
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from './shared/loader/loader.component';
import { AuthServiceService } from './pages/login/auth-service.service';


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet,CommonModule,NavbarComponent,ToastModule,AsyncPipe,LoaderComponent],
  template: `

<div *ngIf="auth.estaLogado(); else loginOnly">
<app-navbar></app-navbar>
  <div class="main-content" [class.with-navbar]="auth.estaLogado()">
    <p-toast position="bottom-right"></p-toast>
    <app-loader [visible]="(loaderService.loading$ | async) ?? false"></app-loader>
    <router-outlet></router-outlet>
  </div>
</div>
  <ng-template #loginOnly>
  <router-outlet></router-outlet>
</ng-template>
  `,
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'Carrinho de Compras';
  constructor(private primeNgConfig : PrimeNGConfig , public loaderService : LoaderService,public auth:AuthServiceService){

  }
  ngOnInit(): void {
   this.primeNgConfig.ripple = true;
  }
}
