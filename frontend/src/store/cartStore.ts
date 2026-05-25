import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/client';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetchCart: async () => {
        set({ loading: true });
        try {
          const response = await apiClient.get('/api/cart');
          set({ items: response.data.items || [] });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          set({ loading: false });
        }
      },

      addItem: async (item) => {
        // Optimistic update
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });

        try {
          await apiClient.post('/api/cart/items', item);
        } catch (error) {
          console.error('Failed to sync item to server:', error);
        }
      },

      removeItem: async (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));

        try {
          await apiClient.delete(`/api/cart/items/${productId}`);
        } catch (error) {
          console.error('Failed to remove item from server:', error);
        }
      },

      updateQuantity: async (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));

        try {
          await apiClient.put(`/api/cart/items/${productId}`, { quantity });
        } catch (error) {
          console.error('Failed to update quantity on server:', error);
        }
      },

      clearCart: async () => {
        set({ items: [] });
        try {
          await apiClient.delete('/api/cart');
        } catch (error) {
          console.error('Failed to clear cart on server:', error);
        }
      },

      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
