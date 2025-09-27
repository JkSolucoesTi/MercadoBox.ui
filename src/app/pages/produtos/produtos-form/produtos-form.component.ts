import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProdutosService } from 'src/app/services/produtos.service';
import { CardModule } from "primeng/card";
import { CategoriaResponse } from 'src/app/model/Dto/response/categoriaResponse';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { BarcodeScannerComponent } from 'src/app/shared/barcode-scanner/barcode-scanner.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-produtos-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    MenubarModule,
    TableModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    CardModule,
    DialogModule,
    BarcodeScannerComponent
  ],
  templateUrl: './produtos-form.component.html',
  styleUrls: ['./produtos-form.component.scss']
})
export class ProdutosFormComponent {

  form!: FormGroup;
  categorias: CategoriaResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtosService: ProdutosService,
    private categoriaService: CategoriaService,
    private notificacao: NotificacaoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      id: [null],
      codigo: [, [Validators.required, Validators.min(0)]],
      nome: ['', Validators.required],
      categoriaId: ["", Validators.required],
      descricao: ["", Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProduto(Number(id));
    }

    this.carregarCategorias();
  }

  /*SETOR DA CAMERA*/
  barcode: string = '';
  showScanner = false;

  openScanner() {
    this.showScanner = true; 
  }

  onBarcodeScanned(code: string) {
    this.form.get('codigo')?.setValue(code);
    this.barcode = code;
    this.showScanner = false; 
  }

  closeScanner() {
    this.showScanner = false; 
  }

  carregarCategorias() {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
      }
      , error: (erro) => {
        this.notificacao.error('Mensagem', `Não foi possível listar as categorias : ${erro.error}`);
      }
    })
  }

  carregarProduto(id: number) {
    this.produtosService.buscarPorId(id).subscribe(produto => {
      this.form.controls['id'].setValue(produto.id);
      this.form.controls['nome'].setValue(produto.nome);
      this.form.controls['codigoBarras'].setValue(produto.codigo);
      this.form.controls['categoriaId'].setValue(String(produto.categoriaId));
      this.form.controls['descricao'].setValue(produto.descricao);
    })
  }

  salvarProduto() {


    let produto = this.form.value;

    if (produto.id) {
      this.produtosService.atualizar(produto).subscribe({
        next: () => {
          this.router.navigate(['/produtos']);
          this.notificacao.success('Mensagem', 'Produto cadastrado com sucesso')
        }, error: (error) => {
          this.notificacao.error('Mensagem', `Não foi possível cadastrar o produto :${error.erro}`)
        }

      })

    } else {
      this.produtosService.criar(produto).subscribe({
        next: () => {
          this.router.navigate(['/produtos']);
          this.notificacao.success('Mensagem', 'Produto atualizado com sucesso')
        }, error: (error) => {
          this.notificacao.error('Mensagem', `Não foi possível atualizar o produto :${error.erro}`)
        }
      });

    }
  }
}
