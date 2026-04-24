import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "../store/hooks";

type Props = {
  children: ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
}