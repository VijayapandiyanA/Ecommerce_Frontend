import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "../Login.css";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue shopping</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="login-button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}