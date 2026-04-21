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
        const res = api.get("/products")
        return (await res).data.data
    }
    catch(err:any){
        rejectWithValue(err.response?.data?.message || "Falied to fetch Products")
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
  Product,                 // ✅ return type
  CreateProductPayload,    // ✅ input type
  { rejectValue: string }  // ✅ error type
>(
  "products/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/products", data);

      // 🔥 IMPORTANT: return actual product
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




export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);











const productSlice = createSlice({
    name:"products",
    initialState,
    reducers:{},

    extraReducers(builder) {
        
builder
       .addCase(fetchProducts.pending,(state)=>{
        state.loading= true,
        state.error = null
       })

       .addCase(fetchProducts.fulfilled,(state,action)=>{
        state.loading= false,
        state.products= action.payload
       })

       .addCase(fetchProducts.rejected,(state,action)=>{
        state.loading = false,
        state.error = action.payload ?? "Error Fetching Products"
       })
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
  state.error = action.payload ?? "Error fetching product";
});
    },
    

    

    
})

export default productSlice.reducer;