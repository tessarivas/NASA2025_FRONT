import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: (
      // <ProtectedRoute>
        <DashboardPage />
      // </ProtectedRoute>
    ) 
  },
  { 
    path: "/dashboard", 
    element: (
      // <ProtectedRoute>
        <DashboardPage />
      // </ProtectedRoute>
    ) 
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);
