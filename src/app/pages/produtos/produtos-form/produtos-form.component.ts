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
import { ProdutosService } from 'src/app/pages/produtos/produtos.service';
import { CardModule } from "primeng/card";
import { CategoriaResponse } from 'src/app/model/Dto/response/categoriaResponse';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { BarcodeScannerComponent } from 'src/app/shared/barcode-scanner/barcode-scanner.component';
import { DialogModule } from 'primeng/dialog';
import { ApiResponse } from 'src/app/model/apiResponse/apiResponse';
import { CheckboxModule } from 'primeng/checkbox';

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
    BarcodeScannerComponent,
    CheckboxModule
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
      codigo: [, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      nome: ['', Validators.required],
      categoriaId: ["", Validators.required],
      descricao: ["", Validators.required],
      ativo: [false],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProduto(Number(id));
    } else {

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
        if (data.success) {
          this.categorias = data.data;
        } else {
          this.notificacao.error('Mensagem', data.message);
        }
      }
      , error: (erro: any) => {
        this.notificacao.error('Mensagem', "Não foi possível carregar os produtos");
      }
    })
  }

  carregarProduto(id: number) {
    this.produtosService.buscarPorId(id).subscribe({
      next: (result) => {
        if (result.success) {
          this.form.controls['id'].setValue(result.data.id);
          this.form.controls['nome'].setValue(result.data.nome);
          this.form.controls['codigo'].setValue(result.data.codigo);
          this.form.controls['categoriaId'].setValue(result.data.categoriaId);
          this.form.controls['descricao'].setValue(result.data.descricao);
          this.form.controls['ativo']?.setValue(result.data.ativo)
        } else {
          this.notificacao.error('Mensagem', result.message);
        }

      }, error: (erro: any) => {
        this.notificacao.error('Mensagem', "Não foi possível carregar os produtos");
      }

    })
  }

  salvarProduto() {
    let produto = this.form.value;
    if (produto.id) {
      this.produtosService.atualizar(produto).subscribe({
        next: (result) => {
          if (result.success) {
            this.router.navigate(['/produtos']);
            this.notificacao.success('Mensagem', 'Produto Atualizado com sucesso');
          }
          else {
            this.notificacao.error('Mensagem', `Não foi possível atualizar o produto :${result.message}`)
          }
        }, error: (error) => {
          this.notificacao.error('Mensagem', `Não foi possível atualizar o produto :${error.erro}`)
        }

      })

    } else {
      this.produtosService.criar(produto).subscribe({
        next: (result) => {
          if (result.success) {
            this.notificacao.success('Mensagem', 'Produto cadastrado com sucesso')
            this.form.reset();
          }
          else {
            this.notificacao.error('Mensagem', `Não foi possível cadastrar o produto :${result.message}`)
          }

        }, error: (error) => {
          this.notificacao.error('Mensagem', `Não foi possível cadastrar o produto :${error.erro}`)
        }
      });

    }
  }
}
