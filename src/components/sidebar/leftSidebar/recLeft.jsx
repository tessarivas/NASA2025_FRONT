import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useFavorites } from '../../../hooks/useFavorites';
import { Clock, Download, Star, LogOut, ChevronLeft, ChevronRight, ArrowLeft, MessageSquare, Heart, X } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { historyAPI, favoritesAPI } from '../../../services/api';

export default function RecLeft({ onMinimizeChange }) {
  const { user, logout } = useCurrentUser();
  const { removeFromFavorites, isRemovingFromFavorites } = useFavorites();
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'history', 'favorites'

  const { data: historyData, isLoading: historyLoading, error: historyError } = useQuery({
    queryKey: ['userHistory'],
    queryFn: historyAPI.getUserHistory,
    enabled: currentView === 'history',
  });

  const { data: favoritesData, isLoading: favoritesLoading, error: favoritesError } = useQuery({
    queryKey: ['userFavorites', user?._id],
    queryFn: () => favoritesAPI.getUserFavorites(user._id),
    enabled: currentView === 'favorites' && !!user?._id,
  });

  const toggleMinimize = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    // Reset to menu view when minimizing
    if (newMinimizedState) {
      setCurrentView('menu');
    }
    // Notificar al componente padre sobre el cambio
    if (onMinimizeChange) {
      onMinimizeChange(newMinimizedState);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    // Si está minimizado, expandir primero
    if (isMinimized) {
      setIsMinimized(false);
      if (onMinimizeChange) {
        onMinimizeChange(false);
      }
    }
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  // Render history list
  const renderHistoryList = () => (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={handleBackToMenu}
          className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="text-white font-medium" style={{fontFamily: 'var(--font-space-mono)'}}>History</h3>
      </div>
      
      {historyLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60">Loading history...</div>
        </div>
      ) : historyError ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-400 text-sm">Error loading history</div>
        </div>
      ) : historyData && historyData.length > 0 ? (
        <div className="space-y-2">
          {historyData.map((item, index) => (
            <div key={index} className="bg-blue-900/40 backdrop-blur-sm rounded-lg p-3 hover:bg-blue-900/60 transition-colors cursor-pointer">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate" style={{fontFamily: 'var(--font-space-mono)'}}>
                    {item.title || item.query || 'Conversation'}
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {new Date(item.createdAt || item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60 text-sm text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No history yet
          </div>
        </div>
      )}
    </div>
  );

  // Render favorites list
  const renderFavoritesList = () => (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={handleBackToMenu}
          className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="text-white font-medium" style={{fontFamily: 'var(--font-space-mono)'}}>Favorites</h3>
      </div>
      
      {favoritesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60">Loading favorites...</div>
        </div>
      ) : favoritesError ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-400 text-sm">Error loading favorites</div>
        </div>
      ) : favoritesData && favoritesData.length > 0 ? (
        <div className="space-y-2">
          {favoritesData.map((articleId, index) => (
            <div key={index} className="bg-blue-900/40 backdrop-blur-sm rounded-lg p-3 hover:bg-blue-900/60 transition-colors">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate" style={{fontFamily: 'var(--font-space-mono)'}}>
                    Article {articleId}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(articleId);
                  }}
                  disabled={isRemovingFromFavorites}
                  className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Remove from favorites"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60 text-sm text-center">
            <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No favorites yet
          </div>
        </div>
      )}
    </div>
  );

  if (isMinimized) {
    return (
      <div className="h-full w-16 flex flex-col rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl overflow-hidden transition-all duration-400 ease-out">
        {/* Minimized User Profile */}
        <div className="m-2 rounded-xl bg-blue-900/40 backdrop-blur-md p-1 shadow-xl flex items-center justify-center transition-all duration-400 ease-out">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-xl transition-all duration-400 ease-out">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        {/* Minimized Menu Icons */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
          <button 
            onClick={() => handleViewChange('history')}
            className="w-full h-10 rounded-lg bg-blue-900/40 backdrop-blur-sm shadow-md hover:bg-blue-900/60 transition-all duration-300 ease-out flex items-center justify-center cursor-pointer transform hover:scale-105 active:scale-95" 
            title="History"
          >
            <Clock className="w-5 h-5 text-orange-400 transition-all duration-200" />
          </button>
          <button 
            onClick={() => handleViewChange('favorites')}
            className="w-full h-10 rounded-lg bg-blue-900/40 backdrop-blur-sm shadow-md hover:bg-blue-900/60 transition-all duration-300 ease-out flex items-center justify-center cursor-pointer transform hover:scale-105 active:scale-95" 
            title="Favorites"
          >
            <Star className="w-5 h-5 text-orange-400 transition-all duration-200" />
          </button>
        </div>

        {/* Expand Button - Área más grande */}
        <div className="p-1 border-t border-white/10">
          <button 
            onClick={toggleMinimize}
            className="w-full h-12 text-white/60 hover:text-white/80 transition-all duration-300 ease-out flex items-center justify-center cursor-pointer rounded-lg hover:bg-white/10 active:bg-white/20 transform hover:scale-105 active:scale-95"
            title="Expand Menu"
          >
            <ChevronRight className="w-5 h-5 transition-transform duration-300 ease-out" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl overflow-hidden transition-all duration-400 ease-out w-full">
      {/* User Profile Card */}
      <div className="m-4 p-4 rounded-2xl bg-blue-900/40 backdrop-blur-md shadow-xl transition-all duration-400 ease-out">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-16 h-16 text-xl rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 ring-4 ring-black/30 flex items-center justify-center text-white font-bold shadow-xl flex-shrink-0 overflow-hidden transition-all duration-400 ease-out">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Welcome Message and Name */}
          <div className="flex-1 min-w-0 transition-all duration-400 ease-out">
            <p
              className="text-orange-400 text-sm -mb-1 font-bold tracking-wide truncate transition-all duration-400 ease-out"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Welcome Back!
            </p>
            <p
              className="text-white font-semi-bold text-lg tracking-tight truncate transition-all duration-400 ease-out"
              style={{ fontFamily: "var(--font-zen-dots)" }}
            >
              {user?.name || "Guest"}
            </p>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-2 py-0.5 bg-orange-500/20 hover:bg-orange-500/50 text-orange-400 hover:text-orange-300 text-xs rounded transition-all duration-300 ease-out flex items-center gap-1.5 group cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <LogOut className="w-3 h-3 transition-all duration-200" />
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

      {/* Content based on current view */}
      <div className="flex-1 overflow-hidden transition-all duration-400 ease-out">
        {currentView === 'history' ? (
          <div className="h-full animate-fadeIn">
            {renderHistoryList()}
          </div>
        ) : currentView === 'favorites' ? (
          <div className="h-full animate-fadeIn">
            {renderFavoritesList()}
          </div>
        ) : (
          /* Default Menu View */
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 h-full animate-fadeIn">
            {/* History */}
            <button 
              onClick={() => handleViewChange('history')}
              className="w-full h-14 rounded-xl bg-blue-900/40 backdrop-blur-sm px-3 shadow-md hover:bg-blue-900/60 hover:border-white/30 transition-all duration-300 ease-out cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            >
              <div className="flex items-center gap-3 pl-4">
                <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 transition-all duration-200" />
                <span 
                  className="text-white text-sm font-medium tracking-wide transition-all duration-300 ease-out" 
                  style={{fontFamily: 'var(--font-space-mono)'}}
                >
                  History
                </span>
              </div>
            </button>

            {/* Favorites */}
            <button 
              onClick={() => handleViewChange('favorites')}
              className="w-full h-14 rounded-xl bg-blue-900/40 backdrop-blur-sm px-3 shadow-md hover:bg-blue-900/60 hover:border-white/30 transition-all duration-300 ease-out cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            >
              <div className="flex items-center gap-3 pl-4">
                <Star className="w-5 h-5 text-orange-400 flex-shrink-0 transition-all duration-200" />
                <span 
                  className="text-white text-sm font-medium tracking-wide transition-all duration-300 ease-out" 
                  style={{fontFamily: 'var(--font-space-mono)'}}
                >
                  Favorites
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Minimize/Expand Button */}
      <div className="border-t border-white/10 p-4 transition-all duration-400 ease-out">
        <button
          onClick={toggleMinimize}
          className="w-full py-3 text-white/60 hover:text-white/80 text-xs font-medium flex items-center justify-center gap-2 transition-all duration-300 ease-out cursor-pointer rounded-lg hover:bg-white/10 active:bg-white/20 transform hover:scale-105 active:scale-95"
          title="Hide Menu"
        >
          <ChevronLeft className="w-4 h-4 transition-transform duration-300 ease-out" />
          <span
            className="transition-all duration-300 ease-out"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Hide Menu
          </span>
        </button>
      </div>
    </div>
  );
}
