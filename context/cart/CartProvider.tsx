import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  /* Effect */

  useEffect(() => {
    try {
      const cartCookieData = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : [];

      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: cartCookieData,
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    /* const productInCart = state.cart.some((item) => item._id === product._id);
    if (!productInCart)
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product],
      }); */

    const productInCartButDifferentSize = state.cart.some(
      (item) => item._id === product._id && item.size === product.size
    );
    if (!productInCartButDifferentSize)
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product],
      });
    /* Acumular */
    const updatedProducts = state.cart.map((item) => {
      if (item._id !== product._id) return item;
      if (item.size !== product.size) return item;
      /* actualizar la cantidad */
      item.quantity += product.quantity;
      return item;
    });

    dispatch({
      type: '[Cart] - Update products in cart',
      payload: updatedProducts,
    });
  };

  return (
    <CartContext.Provider value={{ ...state, addProductToCart }}>
      {children}
    </CartContext.Provider>
  );
};
