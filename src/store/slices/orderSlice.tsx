import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";


interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

interface OrderHistory {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderState {
  orders: OrderHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};




export const placeOrder = createAsyncThunk<
  Order,
  void,
  { rejectValue: string }
>("order/place", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/orders/place");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});



export const fetchOrders = createAsyncThunk<
  OrderHistory[],
  void,
  { rejectValue: string }
>("order/history", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/orders/history");
    return res.data.orders;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});



const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

    
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Order failed";
      })


      
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load orders";
      });
  },
});

export default orderSlice.reducer;