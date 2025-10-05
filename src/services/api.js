const API_URL = 'http://localhost:3000';

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login error. Please check your credentials.');
    }

    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creating account');
    }

    return response.json();
  },
};

export const historyAPI = {
  getUserHistory: async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
    const response = await fetch(`${API_URL}/historical/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error fetching history');
    }

    return response.json();
  },
};

export const favoritesAPI = {
  getUserFavorites: async (userId) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/users/${userId}/favorites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error fetching favorites');
    }

    return response.json();
  },

  addToFavorites: async (userId, articleId) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/users/${userId}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ articleId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error adding to favorites');
    }

    return response.json();
  },

  removeFromFavorites: async (userId, articleId) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/users/${userId}/favorites`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ articleId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error removing from favorites');
    }

    return response.json();
  },
};

export const chatApi = {
  
    chats: async (message) =>{
    const response = await fetch(`${API_URL}/vertex-ai/structured-simple`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'prompt': message
      }),
    } );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar el mensaje');
    }

    return response.json();
  },

  generateTitle: async (message) =>{
    const response = await fetch(`${API_URL}/vertex-ai/generate-title`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'response': message
      }),
    } );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar el mensaje');
    }
    
    return response.json();
  },

  addToHistorical: async (title, userId) => {
    const response = await fetch(`${API_URL}/historical`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'user_id': userId,
        'title': title
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar el mensaje');
    }
    
    return response.json();
  },

  addMessageToHistorial: async (message) => {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'historical_user_id': message.historical_user_id,
        'rol': message.rol,
        'message': message.message,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar el mensaje');
    }
    return response.json();
  }
}
