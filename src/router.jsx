import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DashboardPage from "./pages/dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);
