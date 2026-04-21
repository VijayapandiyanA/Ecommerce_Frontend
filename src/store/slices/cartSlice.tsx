import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";



interface CartItem {
  id: number;
  productId: number;
  quantity: number;

  product: {
    name: string;
    price: number;
    imageUrl: string | null;
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}


const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};



export const addToCartAPI = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number },
  { rejectValue: string }
>("cart/add", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/carts/add", data);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});


export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/get", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/carts");
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});


export const updateCart = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number },
  { rejectValue: string }
>("cart/update", async (data, { rejectWithValue }) => {
  try {
    const res = await api.put("/carts/update", data);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});


export const removeCart = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("cart/remove", async (productId, { rejectWithValue }) => {
  try {
    await api.delete("/carts/remove", {
      data: { productId },
    });

    return productId;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});


export const clearCartAPI = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("cart/clear", async (_, { rejectWithValue }) => {
  try {
    await api.delete("/carts/clear");
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});




const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching cart";
      })


      
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        const existing = state.items.find(
          (item) => item.productId === action.payload.productId
        );

        if (existing) {
          existing.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })



      .addCase(updateCart.fulfilled, (state, action) => {
        const item = state.items.find(
          (i) => i.productId === action.payload.productId
        );
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })


      
      .addCase(removeCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.productId !== action.payload
        );
      })


    
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;