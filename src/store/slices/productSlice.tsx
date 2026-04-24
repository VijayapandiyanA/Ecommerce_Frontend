import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

interface Product{
    id:number;
    name:string;
    description:string;
    price:number;
    imageUrl:string | null;
    stock:number;
    category:string;
    createdAt:string;
    updatedAt:string;

}


interface ProductState{
    products:Product[];
    loading:boolean;
    error:string | null
    selectedProduct: Product | null;

}

interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
}

const initialState: ProductState={

    products:[],
      selectedProduct: null,
    loading:false,
    error:null
}

export const fetchProducts = createAsyncThunk<Product[],
void,
{rejectValue:string}>("products/getAll",async(_,{rejectWithValue})=>{
    try{
        const res = await api.get("/products")
        return res.data.data
    }
   catch (err: any) {
  return rejectWithValue(
    err.response?.data?.message || "Failed to fetch Products"
  );
}
})


export const fetchProductById = createAsyncThunk<
Product,
number,
{rejectValue:string}
>("products/getById", async (id,{rejectWithValue})=>{
     try{
        const res =  await api.get(`/products/${id}`)
        return res.data.data
        
     }catch(err:any){
        return rejectWithValue(
            err.response?.data?.message || "Failed to Fetch product " )
     }

})


export const createProduct = createAsyncThunk<
  Product,               
  CreateProductPayload,    
  { rejectValue: string }  
>(
  "products/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/products", data);

  
      return res.data.data; // or res.data (depends on your API)
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Create failed"
      );
    }
  }
);


export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);




export const deleteProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete product"
    );
  }
});











const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })

      // GET BY ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product";
      })

      // CREATE
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload.data || action.payload;

        state.products = state.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
      })

      // DELETE - THIS FIXES YOUR FIRST ISSUE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete product";
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;


export default productSlice.reducer;
