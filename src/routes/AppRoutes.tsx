import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "../pages/Login";
import  {Register}  from "../pages/Register"
import Products from '../pages/Products'
import { ProductDetails } from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "../components/AdminRoute";
import Home from "../pages/Home";
import Navbar from "../components/Navbar";


export const AppRoutes = () => {
  return (
<BrowserRouter>
<Navbar/>
<Routes>
  <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/products" element={<Products />} />
    <Route path="/products/:id" element={<ProductDetails />} />
   <Route path="/cart" element={<Cart />} />
   <Route path="/orders" element={<Orders />} />
   <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
    
</Routes>
</BrowserRouter>

  )
}
