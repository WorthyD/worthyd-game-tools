import { EntityState } from "@ngrx/entity";
import { CartEntity } from "./cart.models";

export const CART_FEATURE_KEY = 'cart';

export interface CartState extends EntityState<CartEntity> {}

export interface CartPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}
