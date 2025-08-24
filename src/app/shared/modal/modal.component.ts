import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from 'src/app/model/categoria/categoria';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { Subject } from 'rxjs';
import { ItemCarrinho } from 'src/app/model/carrinho/itemCarrinho';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CarrinhoStoreService } from 'src/app/services/carrinho-store.service';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, ButtonModule, ReactiveFormsModule, DropdownModule, CheckboxModule, InputMaskModule,InputNumberModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  public dadosEmitidos$ = new Subject<ItemCarrinho>();
  form!: FormGroup
  categorias: Categoria[] = [];


  constructor(private fb: FormBuilder, private carrinhoStoreService: CarrinhoStoreService ) {
  }

  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  ngOnInit(): void {

    this.form = this.fb.group({
      codigoBarras: ['', [Validators.maxLength(13), Validators.required, Validators.pattern(/^\d{13}$/)]],
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      quantidade: [1, Validators.required],
      promocao: [false],
      valorPromocional: ['']
    });
  }

  get isPromocao(): boolean {
    console.log(this.form.get('promocao')?.value);
    return this.form.get('promocao')?.value;
  }

  cancelar() {
    this.ref.close(null);
  }


  salvar() {
    if (this.form.valid) {
      const itemCarrinho: ItemCarrinho = {
        codigo: this.form.get('codigoBarras')?.value,
        nome: this.form.get('nome')?.value,
        preco: this.form.get('preco')?.value,
        quantidade: this.form.get('quantidade')?.value,
        promocao: this.form.get('promocao')?.value,
        valorPromocional: this.form.get('valorPromocional')?.value
      };
      
        this.carrinhoStoreService.addItem(itemCarrinho);
      this.form.reset();
    } else {
      console.warn('Formulário inválido!');
    }
  }

  onPrecoInput(event: any,formControlName: string) {
  let value = event.target.value.replace(/\D/g, '');
  if (!value) {
    this.form.get(formControlName)?.setValue(null, { emitEvent: false });
    event.target.value = '';
    return;
  }
  const numericValue = parseFloat(value) / 100;
  this.form.get(formControlName)?.setValue(numericValue, { emitEvent: false });
  event.target.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(numericValue);
}


}
