import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  async findAll(@Query('search') search?: string) {
    if (search) {
      return this.productService.search(search);
    }
    return this.productService.findAll();
  }

  @Get('products/:id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('categories')
  async findCategories() {
    return this.productService.findCategories();
  }
}
