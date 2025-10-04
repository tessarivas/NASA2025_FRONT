import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/dashboard.jsx";
import HomePage from "./pages/home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: <HomePage />
  },
  { 
    path: "/dashboard", 
    element: (
      // <ProtectedRoute>
        <DashboardPage />
      // </ProtectedRoute>
    ) 
  },
]);
