import { useEffect, useState, useCallback } from 'react';
import { isValidToken } from '../lib/jwt';

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Función para limpiar datos de autenticación
  const clearAuth = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  }, []);

  // Función para actualizar el estado desde localStorage
  const updateFromStorage = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    // Validar token primero
    if (storedToken) {
      if (isValidToken(storedToken)) {
        setToken(storedToken);
        
        // Solo cargar usuario si el token es válido
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error('Error parsing user:', e);
            setUser(null);
          }
        }
      } else {
        clearAuth();
      }
    } else {
      clearAuth();
    }
  }, [clearAuth]);

  useEffect(() => {
    // Cargar inicialmente
    updateFromStorage();

    // Escuchar cambios en localStorage (para múltiples tabs)
    const handleStorageChange = () => {
      updateFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateFromStorage]);

  const logout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return { 
    user, 
    token, 
    logout, 
    isAuthenticated: !!token && !!user 
  };
}
