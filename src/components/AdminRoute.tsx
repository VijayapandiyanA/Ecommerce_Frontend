import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "../store/hooks";

type Props = {
  children: ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const { token, user } = useAppSelector((state) => state.auth);

  const savedToken = token || localStorage.getItem("token");

  const savedUser =
    user || JSON.parse(localStorage.getItem("user") || "null");

  if (!savedToken) {
    return <Navigate to="/login" replace />;
  }

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  if (savedUser.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
}