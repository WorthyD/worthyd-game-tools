/**
 * Interface for the 'Cart' data
 */
export interface CartEntity {
  itemId: string;
  quantity: number;
}

/**
 * Shape of the cart in local storage
 */
export interface PersistedCart {
  ids: string[];
  entities: Record<string, CartEntity | undefined>;
}
