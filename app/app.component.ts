import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig} from 'primeng/api'
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet,CommonModule,NavbarComponent,ToastModule],
  template: `
   <app-navbar></app-navbar>
  <div class="main-content">
    <p-toast position="bottom-right"></p-toast>
    <router-outlet></router-outlet>
  </div>`,
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'Carrinho de Compras';
  constructor(private primeNgConfig : PrimeNGConfig){

  }
  ngOnInit(): void {
   this.primeNgConfig.ripple = true;
  }
}
