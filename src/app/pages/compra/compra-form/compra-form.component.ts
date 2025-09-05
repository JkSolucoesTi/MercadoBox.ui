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

  constructor(private mercadoService: MercadoService, private compraService: CompraService, private fb: FormBuilder, private router: Router) {
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
        next: (dados) => {
          this.mercadoResponse = dados;
        },
        error: (erro) => {
        console.error("Erro ao carregar mercados:", erro);
        }
      })
  }

  iniciarCompra() {
    if (this.form.valid) {
      let compra = new CompraSignature();
      compra.idMercado = this.form.get('mercadoId')?.value,
        compra.data = this.form.get('data')?.value,
        compra.itens = [],

        this.compraService.criarCompra(compra).subscribe(result => {
          this.router.navigate(['/carrinho/' + result.id]);
        });

    } else {
      console.log('Preencha todos os campos');
    }
  }

}
