import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app-routing.module';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { loaderInterceptor } from './app/core/interceptors/loader.interceptor';

registerLocaleData(localePt, 'pt-BR');

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: LOCALE_ID, useValue:'pt-BR',      
    },    
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loaderInterceptor]) // registra o interceptor funcional
    ),
    provideAnimations(),
    importProvidersFrom(DynamicDialogModule,BrowserAnimationsModule),
    DialogService,
    MessageService     
  ]});
