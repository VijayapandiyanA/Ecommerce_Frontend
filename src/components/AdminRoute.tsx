import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "../store/hooks";

type Props = {
  children: ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const { token, user } = useAppSelector((state) => state.auth);

  // Check localStorage directly as backup if Redux state is empty
  const hasToken = token || localStorage.getItem("token");
  const storedUser = user || (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  // No token means not logged in
  if (!hasToken) {
    console.log("❌ AdminRoute: No token found");
    return <Navigate to="/login" replace />;
  }

  // Token exists but user info is missing (shouldn't happen, but handle it)
  if (!storedUser) {
    console.log("❌ AdminRoute: No user data found");
    return <Navigate to="/login" replace />;
  }

  // Token exists and user exists but not admin
  if (storedUser.role !== "admin") {
    console.log("❌ AdminRoute: User is not admin");
    return <Navigate to="/products" replace />;
  }

  // All checks passed - render admin dashboard
  console.log("✅ AdminRoute: Rendering admin dashboard");
  return <>{children}</>;
}