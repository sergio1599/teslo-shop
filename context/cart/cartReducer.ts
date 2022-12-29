import { ICartProduct, IShippingAddress } from '../../interfaces';
import { CartState } from './';

interface CartSummary {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

type CartActionType =
    | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
    | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
    | { type: '[Cart] - Update cart quantity', payload: ICartProduct }
    | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
    | { type: '[Cart] - Load Address From Cookies', payload: IShippingAddress }
    | { type: '[Cart] - Update Address', payload: IShippingAddress }
    |
    {
        type: '[Cart] - Update order summary',
        payload: CartSummary
    }



export const cartReducer = (state: CartState, action: CartActionType): CartState => {
    switch (action.type) {
        case '[Cart] - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - Update products in cart':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Update cart quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;

                    product.quantity = action.payload.quantity;
                    return action.payload;
                })
            }

        case '[Cart] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter(product => {
                    if (product._id === action.payload._id && product.size === action.payload.size) {
                        return false
                    }
                    return true
                })
            }

        case '[Cart] - Update order summary':
            return {
                ...state,
                ...action.payload
            }
        case '[Cart] - Load Address From Cookies':
        case '[Cart] - Update Address':
            return {
                ...state,
                shippingAddress: action.payload
            }

        default:
            return state;
    }
}