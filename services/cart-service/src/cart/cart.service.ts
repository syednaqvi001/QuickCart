import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
}

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  private readonly CART_PREFIX = 'cart:';

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCart(userId: string): Promise<Cart> {
    const data = await this.redis.get(`${this.CART_PREFIX}${userId}`);
    if (!data) {
      return { userId, items: [], totalPrice: 0 };
    }
    return JSON.parse(data);
  }

  async addItem(userId: string, item: CartItem): Promise<Cart> {
    const cart = await this.getCart(userId);
    const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    cart.totalPrice = this.calculateTotal(cart.items);
    await this.saveCart(cart);
    return cart;
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.totalPrice = this.calculateTotal(cart.items);
    await this.saveCart(cart);
    return cart;
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(i => i.productId === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    cart.totalPrice = this.calculateTotal(cart.items);
    await this.saveCart(cart);
    return cart;
  }

  async clearCart(userId: string): Promise<void> {
    await this.redis.del(`${this.CART_PREFIX}${userId}`);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private async saveCart(cart: Cart): Promise<void> {
    await this.redis.set(
      `${this.CART_PREFIX}${cart.userId}`,
      JSON.stringify(cart),
      'EX',
      60 * 60 * 24 * 7 // 7 days expiration
    );
  }
}
