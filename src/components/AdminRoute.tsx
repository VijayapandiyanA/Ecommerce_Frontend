import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "../store/hooks";

type Props = {
  children: ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const { token, user, loading } = useAppSelector((state) => state.auth);

  // While auth is loading, show nothing (prevents redirect flashing)
  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;
  }

  // No token means not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but user info is missing (shouldn't happen, but handle it)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Token exists and user exists but not admin
  if (user.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  // All checks passed - render admin dashboard
  return <>{children}</>;
}