import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import HomePage from "./pages/home.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/home", element: <HomePage /> },
]);
