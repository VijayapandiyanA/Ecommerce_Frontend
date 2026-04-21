import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";




  
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface RegisterResponse{
    id:number,
    name:string,
    email:string,
    role:string
}



interface AuthState{
    user:User| null,
    token:string | null,
    loading:boolean,
    error:string | null
}


interface LoginResponse{
    
    token:string,
    user:User

}




const initialState:AuthState={

    user:null,
    token:localStorage.getItem("token"),
    loading:false,
    error:null

}




export  const loginUser = createAsyncThunk<
LoginResponse,
{email:string,password:string},
{rejectValue:string}>

(
    "auth/login",
    async (data,{rejectWithValue})=>{

        try{
            const res =  await api.post("users/login",data)
            return  res.data
        }catch(err:any){
            return rejectWithValue(err.response.data.message)
        }
    }
    

      
)


export const registerUser = createAsyncThunk<
RegisterResponse,
{name:string;email:string;password:string; role: string;},
{rejectValue:string}>(
   "auth/register",
   async (data,{rejectWithValue})=>{
    try{
        const res=await api.post("users/register",data)
        return res.data
    }
    catch(err:any){
        return rejectWithValue(err.response?.data?.message||"Register failed")
    }
   }
)


const authSlice = createSlice({

    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
      state.token = null;
      localStorage.removeItem("token");

        },
        

    },

    extraReducers(builder) {
        builder
        .addCase(loginUser.pending ,(state)=>{
            state.loading= true,
            state.error=null
        } )

              .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;

        localStorage.setItem("token", action.payload.token);
      })

       .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })


    //REGISTER

      .addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    //   state.user = action.payload;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Register failed";
    });
}
    })


  


    
    



export const { logout } = authSlice.actions;
export default authSlice.reducer;