import { useCurrentUser } from "../../../hooks/useCurrentUser";
import {
  Clock,
  Star,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function RecLeft({ onMinimizeChange }) {
  const { user, logout } = useCurrentUser();
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    // Notificar al componente padre sobre el cambio
    if (onMinimizeChange) {
      onMinimizeChange(newMinimizedState);
    }
  };

  return (
    <div
      className={`h-full flex flex-col rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl overflow-hidden transition-all duration-300 ease-out ${
        isMinimized ? "w-16" : "w-full"
      }`}
    >
      {/* User Profile Card */}
      <div
        className={`transition-all duration-300 ease-out ${
          isMinimized 
            ? "m-2 flex justify-center rounded-2xl bg-blue-900/40 backdrop-blur-md shadow-xl" 
            : "m-4 p-4 rounded-2xl bg-blue-900/40 backdrop-blur-md shadow-xl"
        }`}
      >
        <div className={`flex items-center ${isMinimized ? '' : 'gap-3'}`}>
          {/* Profile Picture */}
          <div
            className={`flex items-center justify-center text-white font-bold shadow-xl flex-shrink-0 overflow-hidden transition-all duration-300 ease-out ${
              isMinimized 
                ? "w-8 h-8 text-lg rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 ring-2 ring-black/20" 
                : "w-16 h-16 text-xl rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 ring-4 ring-black/30"
            }`}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Welcome Message and Name - Solo visible cuando no está minimizado */}
          <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-out ${
            isMinimized ? 'opacity-0 w-0' : 'opacity-100 w-full'
          }`}>
            <p
              className="text-orange-400 text-sm -mb-1 font-bold tracking-wide truncate"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Welcome Back!
            </p>
            <p
              className="text-white font-semi-bold text-lg tracking-tight truncate"
              style={{ fontFamily: "var(--font-zen-dots)" }}
            >
              {user?.name || "Guest"}
            </p>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-2 py-0.5 bg-orange-500/20 hover:bg-orange-500/50 text-orange-400 hover:text-orange-300 text-xs rounded transition-all duration-200 flex items-center gap-1.5 group cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span
                className="font-medium truncate"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Log out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden pb-4 transition-all duration-300 ease-out ${
          isMinimized ? "px-2 space-y-2" : "px-4 space-y-3"
        }`}
      >
        {/* History */}
        <button
          className={`w-full rounded-xl bg-blue-900/40 backdrop-blur-sm shadow-md hover:bg-blue-900/60 hover:border-white/30 transition-all duration-200 cursor-pointer ${
            isMinimized ? "h-10 px-0" : "h-14 px-3"
          }`}
          title={isMinimized ? "History" : ""}
        >
          <div
            className={`flex items-center transition-all duration-300 ease-out ${
              isMinimized ? "justify-center" : "gap-3 pl-4"
            }`}
          >
            <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <span
              className={`text-white text-sm font-medium tracking-wide transition-all duration-300 ease-out ${
                isMinimized ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              History
            </span>
          </div>
        </button>

        {/* Favorites */}
        <button
          className={`w-full rounded-xl bg-blue-900/40 backdrop-blur-sm shadow-md hover:bg-blue-900/60 hover:border-white/30 transition-all duration-200 cursor-pointer ${
            isMinimized ? "h-10 px-0" : "h-14 px-3"
          }`}
          title={isMinimized ? "Favorites" : ""}
        >
          <div
            className={`flex items-center transition-all duration-300 ease-out ${
              isMinimized ? "justify-center" : "gap-3 pl-4"
            }`}
          >
            <Star className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <span
              className={`text-white text-sm font-medium tracking-wide transition-all duration-300 ease-out ${
                isMinimized ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Favorites
            </span>
          </div>
        </button>
      </div>

      {/* Minimize/Expand Button */}
      <div
        className={`border-t border-white/10 transition-all duration-300 ease-out ${
          isMinimized ? "p-2" : "p-4"
        }`}
      >
        <button
          onClick={toggleMinimize}
          className="w-full py-2 text-white/60 hover:text-white/80 text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200 hover:scale-105 cursor-pointer"
          title={isMinimized ? "Expand Menu" : "Hide Menu"}
        >
          {isMinimized ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span
                className={`transition-all duration-300 ease-out ${
                  isMinimized ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Hide Menu
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
