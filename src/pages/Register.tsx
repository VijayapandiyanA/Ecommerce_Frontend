import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "../Register.css";

export const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are Required");
      return;
    }

    const result = await dispatch(
      registerUser({
        name,
        email,
        password,
        role: "user",
      })
    );

    if (registerUser.fulfilled.match(result)) {
      alert("Registration successful! Please login.");
      navigate("/login");
    }
  };

  return (
    <div className="register-page">
      <div className="register-overlay"></div>

      <div className="register-box">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join us and start shopping</p>

        <form onSubmit={handleRegister} className="register-form">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="register-input"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />

          <button type="submit" disabled={loading} className="register-button">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {error && <p className="register-error">{error}</p>}

        <p className="register-login">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};