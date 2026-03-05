const apiUrl = "http://127.0.0.1:8000";

const api = {
  post: async function(endpoint, payload) {
    const token = localStorage.getItem("token"); // get token fresh each time
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // only add auth header if token exists
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    return response.json();
  },

  get: async function(endpoint) {
    const token = localStorage.getItem("token"); // get token fresh each time
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      }
    });
    return response.json();
  }
};

export default api;
export { api };