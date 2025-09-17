export class ItemCarrinhoSignature {
  guid!: string | null;
  produtoId!: number;
  nome: string = '';
  preco!: number;
  promocao!: boolean;
  quantidade!: number;
  valorPromocional!: number;

  constructor(init?: Partial<ItemCarrinhoSignature>) {
    Object.assign(this, init);
  }
}