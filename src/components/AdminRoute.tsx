import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function AdminRoute({ children }: any) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}