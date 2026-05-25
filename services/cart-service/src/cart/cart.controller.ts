import { Controller, Get, Post, Put, Delete, Body, Headers, Param } from '@nestjs/common';
import { CartService, CartItem } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Headers('x-user-id') userId: string) {
    // For demo/development if header is missing, use a test id
    const id = userId || 'test-user-id';
    return this.cartService.getCart(id);
  }

  @Post('items')
  async addItem(@Headers('x-user-id') userId: string, @Body() item: CartItem) {
    const id = userId || 'test-user-id';
    return this.cartService.addItem(id, item);
  }

  @Put('items/:productId')
  async updateQuantity(
    @Headers('x-user-id') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number
  ) {
    const id = userId || 'test-user-id';
    return this.cartService.updateQuantity(id, productId, quantity);
  }

  @Delete('items/:productId')
  async removeItem(@Headers('x-user-id') userId: string, @Param('productId') productId: string) {
    const id = userId || 'test-user-id';
    return this.cartService.removeItem(id, productId);
  }

  @Delete()
  async clearCart(@Headers('x-user-id') userId: string) {
    const id = userId || 'test-user-id';
    return this.cartService.clearCart(id);
  }
}
