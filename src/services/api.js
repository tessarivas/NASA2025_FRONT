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
      throw new Error(error.message || 'Error al iniciar sesión');
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
      throw new Error(error.message || 'Error al registrar usuario');
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
    const response = await fetch(`${API_URL}/historical/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'historical_user_id': message.historical_id,
        'rol': message.text,
        'message': message.sender,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar el mensaje');
    }
    return response.json();
  }
}
