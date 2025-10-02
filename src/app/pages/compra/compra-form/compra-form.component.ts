import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { Mercado, MercadoService } from '../../../services/mercado.service';
import { CompraService } from 'src/app/services/compra.service';
import { Compra } from 'src/app/model/compra/compra';
import { CardModule } from 'primeng/card';

import { Router } from '@angular/router';
import { StatusE } from 'src/app/model/enum/statusE';
import { CompraSignature } from 'src/app/model/Dto/signature/compraSignature';
import { MercadoResponse } from 'src/app/model/Dto/response/mercadoResponse';
import { NotificacaoService } from 'src/app/shared/notificacao.service';

@Component({
  selector: 'app-compra-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, CalendarModule, ButtonModule, CardModule, ReactiveFormsModule],
  templateUrl: './compra-form.component.html',
  styleUrls: ['./compra-form.component.scss']
})
export class CompraFormComponent implements OnInit {

  mercadoResponse: MercadoResponse[] = [];
  form!: FormGroup;

  constructor(
    private mercadoService: MercadoService,
    private notificacao: NotificacaoService,
    private compraService: CompraService,
    private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {
    this.carregarMercados();
    this.form = this.fb.group({
      mercadoId: [null, Validators.required],
      data: [new Date(), Validators.required]
    })
  }

  carregarMercados() {
    this.mercadoService.listar()
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.mercadoResponse = response.data;
          }else{
            this.notificacao.error("Mercado",response.message);
          }
        },
        error: () => {
          console.error("Erro ao carregar mercados:");
        }
      })
  }

  iniciarCompra() {
    if (this.form.valid) {
      let compra = new CompraSignature();
      compra.mercadoId = this.form.get('mercadoId')?.value,
        compra.data = this.form.get('data')?.value,
        compra.itens = [],

        this.compraService.criarCompra(compra).subscribe(
          {
            next: (response) => {
              if (response.success) {
                this.router.navigate(['/carrinho/' + response.data.guid]);
                this.notificacao.success('Mensagem', response.message);
              } else {
                this.notificacao.error('Mensagem', response.message);
              }
            }
            , error: () => {
              this.notificacao.error('Mensagem', "Não foi possível iniciar sua compra");
            }
          });

    } else {
      this.notificacao.warn('Mensagem', 'Preencher os campos obrigatórios');
    }
  }

}
