import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { Clock, Download, Star, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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

  if (isMinimized) {
    return (
      <div className="h-full w-16 flex flex-col rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl overflow-hidden">
        {/* Minimized User Profile */}
        <div className="m-2 rounded-xl bg-blue-900/40 backdrop-blur-md p-1 shadow-xl flex items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        {/* Minimized Menu Icons */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
          <button className="w-full h-10 rounded-lg bg-blue-900/40 backdrop-blur-sm shadow-md hover:bg-blue-900/60 transition-all duration-200 flex items-center justify-center" title="History">
            <Clock className="w-5 h-5 text-orange-400" />
          </button>
          <button className="w-full h-10 rounded-lg bg-blue-900/40 backdrop-blur-sm shadow-md hover:bg-blue-900/60 transition-all duration-200 flex items-center justify-center" title="Saves">
            <Download className="w-5 h-5 text-orange-400" />
          </button>
          <button className="w-full h-10 rounded-lg bg-blue-900/40 backdrop-blur-sm shadow-md hover:bg-blue-900/60 transition-all duration-200 flex items-center justify-center" title="Favorites">
            <Star className="w-5 h-5 text-orange-400" />
          </button>
        </div>

        {/* Expand Button */}
        <div className="p-2 border-t border-white/10">
          <button 
            onClick={toggleMinimize}
            className="w-full h-8 text-white/60 hover:text-white/80 transition-colors flex items-center justify-center"
            title="Expand Menu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl overflow-hidden transition-all duration-300">
      {/* User Profile Card */}
      <div className="m-4 rounded-2xl bg-blue-900/40 backdrop-blur-md p-4 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-xl ring-4 ring-black/30 flex-shrink-0 overflow-hidden">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          {/* Welcome Message and Name */}
          <div className="flex-1 min-w-0">
            <p className="text-orange-400 text-xs font-bold tracking-wide truncate" style={{fontFamily: 'var(--font-space-mono)'}}>Welcome Back!</p>
            <p className="text-white font-semi-bold text-lg tracking-tight truncate mb-1" style={{fontFamily: 'var(--font-zen-dots)'}}>{user?.name || 'Guest'}</p>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-2 py-1 bg-transparent hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 text-xs rounded transition-all duration-200 flex items-center gap-1.5 group"
            >
              <LogOut className="w-3 h-3" />
              <span className="font-medium truncate" style={{fontFamily: 'var(--font-space-mono)'}}>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {/* History */}
        <button className="w-full h-16 rounded-t-xl bg-blue-900/40 backdrop-blur-sm px-3 shadow-md hover:bg-blue-900/60 hover:border-white/30 transition-all duration-200 ">
          <div className="flex items-center gap-3 pl-4">
            <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <span className="text-white text-sm font-medium tracking-wide" style={{fontFamily: 'var(--font-space-mono)'}}>History</span>
          </div>
        </button>

        {/* Saves */}
        <button className="w-full h-16 bg-blue-900/40 backdrop-blur-sm px-3 shadow-md hover:bg-blue-900/60 hover:border-white/30 transition-all duration-200">
          <div className="flex items-center gap-3 pl-4">
            <Download className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <span className="text-white text-sm font-medium tracking-wide" style={{fontFamily: 'var(--font-space-mono)'}}>Saves</span>
          </div>
        </button>

        {/* Favorites */}
        <button className="w-full h-16 rounded-b-xl bg-blue-900/40 backdrop-blur-sm px-3 shadow-md hover:bg-blue-900/60 hover:border-white/30 transition-all duration-200">
          <div className="flex items-center gap-3 pl-4">
            <Star className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <span className="text-white text-sm font-medium tracking-wide" style={{fontFamily: 'var(--font-space-mono)'}}>Favorites</span>
          </div>
        </button>
      </div>

      {/* Minimize Menu Button */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={toggleMinimize}
          className="w-full py-2 text-white/60 hover:text-white/80 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span style={{fontFamily: 'var(--font-space-mono)'}}>Hide Menu</span>
        </button>
      </div>
    </div>
  )
}