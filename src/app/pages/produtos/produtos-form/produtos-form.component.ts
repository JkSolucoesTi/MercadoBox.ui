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
import { Categoria } from 'src/app/model/categoria/categoria';
import { ProdutosService } from 'src/app/services/produtos.service';
import { CardModule } from "primeng/card";
import { ProdutoCompleto } from 'src/app/model/produto/produtoCompleto';

@Component({
  selector: 'app-produtos-form',
    standalone:true,
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
    CardModule
],
  templateUrl: './produtos-form.component.html',
  styleUrls: ['./produtos-form.component.scss']
})
export class ProdutosFormComponent {

  form!: FormGroup;
  categorias: Categoria[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtosService: ProdutosService,
    private fb: FormBuilder
  ) {}
  
    ngOnInit(): void {

      debugger;
      this.listarCategoria();    

      this.form = this.fb.group({
        id:[null],
        codigoBarras: [0, [Validators.required, Validators.min(0)]],
        nome: ['', Validators.required],
        categoria: ["", Validators.required],
        descricao: ["",Validators.required]
      });  

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.carregarProduto(Number(id));       
      }
    }
 
    listarCategoria(){
      this.produtosService.getCategorias().subscribe((categorias) => {
        this.categorias = categorias; 
      });  
    }
  
    carregarProduto(id: number) {
      this.produtosService.buscarPorId(id).subscribe( produto =>{
        this.form.controls['id'].setValue(produto.id);
        this.form.controls['nome'].setValue(produto.nome);
        this.form.controls['codigoBarras'].setValue(produto.codigo);
        this.form.controls['categoria'].setValue(String(produto.categoria));
        this.form.controls['descricao'].setValue(produto.descricao);
      })
    }
  
    salvarProduto() {
      let produto: ProdutoCompleto
      produto = this.form.value;

      if (produto.id) {
        this.produtosService.atualizar(produto).subscribe(() => {
        });
  
      } else {
        this.produtosService.criar(produto).subscribe(() => {
        });
  
      }
      this.router.navigate(['/produtos']);
    }  
  

}
