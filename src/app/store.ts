import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/slices/authSlice'
import productReducer  from '../store/slices/productSlice'
import cartReducer from "../store/slices/cartSlice";
import orderReducer from "../store/slices/orderSlice";

export const store = configureStore({
    reducer:{
        auth:authReducer,
         products: productReducer,
         cart: cartReducer,
         order: orderReducer, 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serialization checks
                ignoredActions: ['auth/login/fulfilled'],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;