export class ProductDto {
  id?: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  count: number;

  constructor(data: ProductDto) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.price = Number(data.price);
    this.image = data.image;
    this.count = Number(data.count);
  }
}