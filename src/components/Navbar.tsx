import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import "../Navbar.css";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      
      {/* LOGO */}
      <h2 className="logo">🛍 MyShop</h2>

      {/* LINKS */}
      <div className="nav-links">

        <Link to="/" className="nav-btn">Home</Link>
        <Link to="/products" className="nav-btn">Products</Link>

        {!user && (
          <>
            <Link to="/login" className="nav-btn login">Login</Link>
            <Link to="/register" className="nav-btn register">Register</Link>
          </>
        )}

        {user && (
          <>
            <span className="welcome">Hello, {user.name}</span>

            <button onClick={handleLogout} className="nav-btn logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}