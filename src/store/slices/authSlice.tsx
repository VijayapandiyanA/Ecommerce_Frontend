import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";





interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface RegisterResponse {
    id: number,
    name: string,
    email: string,
    role: string
}



interface AuthState {
    user: User | null,
    token: string | null,
    loading: boolean,
    error: string | null
}


interface LoginResponse {

    token: string,
    user: User

}




// Helper functions to safely get auth data from localStorage
const getInitialToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("✅ Token restored from localStorage");
    }
    return token;
  } catch (err) {
    console.error("Error reading token from localStorage:", err);
    return null;
  }
};

const getInitialUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("✅ User restored from localStorage:", user.email);
      return user;
    }
  } catch (err) {
    console.error("Error reading user from localStorage:", err);
  }
  return null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
  loading: false,
  error: null
}




export const loginUser = createAsyncThunk<
    LoginResponse,
    { email: string, password: string },
    { rejectValue: string }>

    (
        "auth/login",
        async (data, { rejectWithValue }) => {

            try {
                const res = await api.post("/users/login", data)
                return res.data
            } catch (err: any) {
                return rejectWithValue(err.response.data.message)
            }
        }



    )


export const registerUser = createAsyncThunk<
    RegisterResponse,
    { name: string; email: string; password: string; role: string; },
    { rejectValue: string }>(
        "auth/register",
        async (data, { rejectWithValue }) => {
            try {
                const res = await api.post("/users/register", data)
                return res.data
            }
            catch (err: any) {
                return rejectWithValue(err.response?.data?.message || "Register failed")
            }
        }
    )


const authSlice = createSlice({

    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },


    },

    extraReducers(builder) {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            })

           .addCase(loginUser.fulfilled, (state, action) => {
  state.loading = false;
  state.token = action.payload.token;
  state.user = action.payload.user;

  localStorage.setItem("token", action.payload.token);
  localStorage.setItem("user", JSON.stringify(action.payload.user));
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