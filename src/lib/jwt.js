/**
 * Decodifica un JWT sin verificar la firma (solo para obtener el payload)
 * @param {string} token - El token JWT
 * @returns {object|null} - El payload decodificado o null si es inválido
 */
export function decodeJWT(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Verifica si un token JWT ha expirado
 * @param {string} token - El token JWT
 * @returns {boolean} - true si el token ha expirado o es inválido
 */
export function isTokenExpired(token) {
  const decoded = decodeJWT(token);
  
  if (!decoded || !decoded.exp) {
    return true; // Si no se puede decodificar o no tiene exp, considerarlo expirado
  }

  const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
  return decoded.exp < currentTime;
}

/**
 * Obtiene el tiempo restante de un token en segundos
 * @param {string} token - El token JWT
 * @returns {number} - Segundos restantes (0 si expiró o es inválido)
 */
export function getTokenTimeRemaining(token) {
  const decoded = decodeJWT(token);
  
  if (!decoded || !decoded.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const remaining = decoded.exp - currentTime;
  return remaining > 0 ? remaining : 0;
}

/**
 * Valida si un token es válido (bien formado y no expirado)
 * @param {string} token - El token JWT
 * @returns {boolean} - true si el token es válido
 */
export function isValidToken(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Verificar formato básico
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Intentar decodificar
  const decoded = decodeJWT(token);
  if (!decoded) {
    return false;
  }


  // Si no tiene exp, asumir que es válido (token sin expiración)
  if (!decoded.exp) {
    return true;
  }

  // Verificar si no ha expirado
  const isExpired = isTokenExpired(token);
  return !isExpired;
}
