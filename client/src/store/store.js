import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import productReducer from "./productSlice"
import cartReducer from "./cartProduct"
import orderReducer from "./orderSlice"
import addressReducer from "./addressSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cartItem: cartReducer,
    addresses: addressReducer,
    orders: orderReducer,
  },
})
