import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/dashboard.jsx";
import HomePage from "./pages/home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: <HomePage />
  },
  { 
    path: "/dashboard", 
    element: (
      // <ProtectedRoute>
        <ChatProvider>
          <DashboardPage />
        </ChatProvider>
      // </ProtectedRoute>
    ) 
  },
]);
