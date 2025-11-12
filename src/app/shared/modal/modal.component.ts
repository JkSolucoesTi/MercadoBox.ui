import { CompraService } from './../../services/compra.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from 'src/app/model/categoria/categoria';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ItemCarrinho } from 'src/app/model/carrinho/itemCarrinho';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CarrinhoStoreService } from 'src/app/pages/carrinho-form/service/carrinho-store.service';
import { ProdutoResponse } from 'src/app/model/Dto/response/produtoResponse';
import { ProdutosService } from 'src/app/services/produtos.service';
import { ProdutoPesquisaSignature } from 'src/app/model/Dto/signature/produtoPesquisaSignature';
import { ItemCarrinhoSignature } from 'src/app/model/Dto/signature/itemCarrinhoSignature';
import { CarrinhoService } from 'src/app/pages/carrinho-form/service/carrinho.service';
import { NotificacaoService } from '../notificacao.service';
import { BarcodeScannerComponent } from '../barcode-scanner/barcode-scanner.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    CheckboxModule,
    InputMaskModule,
    InputNumberModule,
    AutoCompleteModule,
    BarcodeScannerComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  public dadosEmitidos$ = new Subject<ItemCarrinho>();
  form!: FormGroup
  categorias: Categoria[] = [];


  constructor(private fb: FormBuilder,
    private carrinhoStoreService: CarrinhoStoreService,
    private compraService: CompraService,
    private produtoService: ProdutosService,
    private notificacao: NotificacaoService,
    private carrinhoServiceBehavior: CarrinhoService

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

  /*SETOR CAMERA */
  showScanner = false;

  openScanner() {
    this.showScanner = true;
  }

  onBarcodeScanned(code: string) {

    const produtoLido = { codigo: code, nome: '' };
    this.form.get('codigoDeBarras')?.setValue(produtoLido);   
    this.search(code,'' ); 
    this.showScanner = false;
  }

  closeScanner() {
    this.showScanner = false;
  }

  get isPromocao(): boolean {
    return this.form.get('promocao')?.value;
  }

  search(eventCodigo: any,eventNome: any) {
    let produtoPesquisaSignature = new ProdutoPesquisaSignature();
    produtoPesquisaSignature.codigo = eventCodigo.query;
    produtoPesquisaSignature.nome = eventNome.query;
    this.produtoService.searchByCodigo(produtoPesquisaSignature).subscribe({
      next: (data) => {
        if(data.length == 0)  this.notificacao.info('Mensagem', `Não foi possível encontrar seu produto`)
        this.produtosFiltrados = data
      },
      error: (err) => {
        this.notificacao.error('Mensagem', `Não foi possível encontrar seu produto : ${err.error}`)
      }
    });
  }

  onProdutoSelecionado(produtoResponse: ProdutoResponse) {
    debugger;
  this.form.patchValue({
    codigoDeBarras: { codigo: produtoResponse.codigo, nome: produtoResponse.nome },
    nome: { nome : produtoResponse.nome},
    preco: produtoResponse.preco ?? 0,
    produtoSelecionado: produtoResponse.id
  });
  }

  cancelar() {
    this.ref.close(null);
  }


  salvar() {
    if (this.form.valid) {

      let nomeProduto = this.form.get('nome')?.value;


      const itemCarrinho: ItemCarrinhoSignature = {
        guid: this.carrinhoStoreService.getCompraGuid(),
        produtoId: this.form.get('produtoSelecionado')?.value,
        nome: nomeProduto.nome,
        preco: this.form.get('preco')?.value,
        quantidade: this.form.get('quantidade')?.value,
        promocao: this.form.get('promocao')?.value,
        valorPromocional: this.form.get('valorPromocional')?.value
      };
      this.compraService.AdicionarItemCarrinho(itemCarrinho).subscribe({
        next: () => {
          this.cancelar();
          this.carrinhoServiceBehavior.notificarAtualizacao(true);
          this.notificacao.success("Mensagem", "Item adicionado ao carrinho");
        }, error: (erro: any) => {
          this.notificacao.error("Mensagem", `Não foi possível adicionar o item no carrinho : ${erro.error}`)
        }
      })
    } else {
      this.notificacao.info("Mensagem","Codigo de barras / Nome do Produto são campos obrigatórios")
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
