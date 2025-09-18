import { CompraService } from './../../services/compra.service';
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
import { debounceTime, Subject } from 'rxjs';
import { ItemCarrinho } from 'src/app/model/carrinho/itemCarrinho';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CarrinhoStoreService } from 'src/app/services/carrinho-store.service';
import { ProdutoResponse } from 'src/app/model/Dto/response/produtoResponse';
import { ProdutosService } from 'src/app/services/produtos.service';
import { ProdutoPesquisaSignature } from 'src/app/model/Dto/signature/produtoPesquisaSignature';
import { ItemCarrinhoSignature } from 'src/app/model/Dto/signature/itemCarrinhoSignature';
import { CarrinhoService } from 'src/app/pages/carrinho-form/service/carrinho.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, ButtonModule, ReactiveFormsModule, DropdownModule, CheckboxModule, InputMaskModule, InputNumberModule, AutoCompleteModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  public dadosEmitidos$ = new Subject<ItemCarrinho>();
  form!: FormGroup
  categorias: Categoria[] = [];


  constructor(private fb: FormBuilder,
    private carrinhoStoreService: CarrinhoStoreService,
    private compraService : CompraService,
    private produtoService: ProdutosService,
    private carrinhoServiceBehavior : CarrinhoService

  ) {
  }

  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  produtosFiltrados: ProdutoResponse[] = [];
  selectedProduto!: ProdutoResponse;

  ngOnInit(): void {

    this.form = this.fb.group({
      produtoSelecionado: [null],
      codigoDeBarras: ['', [Validators.required]],
      nome: ['', Validators.required],
      preco: [0, Validators.required],
      quantidade: [1, Validators.required],
      promocao: [false],
      valorPromocional: [0]
    });
  }

  get isPromocao(): boolean {
    return this.form.get('promocao')?.value;
  }

  search(event: any) {
    let produtoPesquisaSignature = new ProdutoPesquisaSignature(event.query);
    this.produtoService.searchByCodigo(produtoPesquisaSignature).subscribe({
      next: (data) => {       
        this.produtosFiltrados = data
      },
      error: (err) => console.error(err)
    });
  }

  onProdutoSelecionado(produtoResponse: ProdutoResponse) {
    this.form.get("nome")?.setValue(produtoResponse.nome);
    this.form.get('codigo')?.setValue(produtoResponse.codigo?.toString());     
      this.form.get('produtoSelecionado')?.setValue(produtoResponse.id);     
  }

  cancelar() {
    this.ref.close(null);
  }


  salvar() {
    if (this.form.valid) {
      debugger;
      const itemCarrinho: ItemCarrinhoSignature = {
        guid: this.carrinhoStoreService.getCompraGuid(),
        produtoId : this.form.get('produtoSelecionado')?.value,
        nome: this.form.get('nome')?.value,
        preco: this.form.get('preco')?.value,
        quantidade: this.form.get('quantidade')?.value,
        promocao: this.form.get('promocao')?.value,
        valorPromocional: this.form.get('valorPromocional')?.value 
      };    
      this.compraService.AdicionarItemCarrinho(itemCarrinho).subscribe({
        next : (value: any) =>{
          console.log(value);
          this.cancelar();
          this.carrinhoServiceBehavior.notificarAtualizacao(true);
        },error : (erro : any) =>{

        }
      })     
    } else {
      console.warn('Formulário inválido!');
    }
  }

  onPrecoInput(event: any, formControlName: string) {
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
