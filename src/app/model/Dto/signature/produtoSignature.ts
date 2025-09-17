export class ProdutoSignature{
     id?: number;
    codigo?:string;
    nome?: string;
    preco?: number;
    categoriaId?: number;
    descricao?: string;

    public Create (codigo:string,nome:string,preco:number,categoriaId:number,descricao:string) : ProdutoSignature 
    {
        let produtoSignature = new ProdutoSignature();
        produtoSignature.codigo = codigo;
        produtoSignature.nome = nome;
        produtoSignature.preco = preco;
        produtoSignature.categoriaId = categoriaId;
        produtoSignature.descricao = descricao;

        return produtoSignature;
    }


}
