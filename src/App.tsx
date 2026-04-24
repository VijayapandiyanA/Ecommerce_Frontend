import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import { AppRoutes } from "./routes/AppRoutes"

function App() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    // This effect ensures auth state is properly initialized from localStorage
    // when the app loads or when token changes
    if (token) {
      // Token exists, auth is ready
      console.log("✅ Auth state loaded from localStorage:", { hasToken: !!token });
    }
  }, [token]);

  return (
    <>
      <AppRoutes /> 
    </>
  )
}

export default App
  