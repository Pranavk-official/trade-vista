const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiCall = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  if (!response.ok) {
    throw new Error("API call failed");
  }
  return response.json();
};

// Admin Views
export const fetchStocks = () => apiCall("/admin/stocks");
export const fetchClients = () => apiCall("/admin/clients");
export const fetchStockById = (id) => apiCall(`/admin/stocks/${id}`);
export const fetchClientById = (id) => apiCall(`/admin/clients/${id}`);

// Admin Actions
export const manageStock = (stockData) =>
  apiCall("/admin/manage-stock", "POST", stockData);
export const createUser = (userData) =>
  apiCall("/admin/create-user", "POST", userData);
export const buyStockForClient = (tradeData) =>
  apiCall("/admin/buy-stock", "POST", tradeData);
export const sellStockForClient = (tradeData) =>
  apiCall("/admin/sell-stock", "POST", tradeData);

// Client Operations
export const fetchClientDashboard = () => apiCall("/client/dashboard");
export const addClientFunds = (fundsData) =>
  apiCall("/client/add-funds", "POST", fundsData);

// Authentication
export const adminLogin = (credentials) =>
  apiCall("/admin/login", "POST", credentials);
export const clientLogin = (credentials) =>
  apiCall("/client/login", "POST", credentials);

// Password Reset (Note: This endpoint might need to be corrected)
export const initiatePasswordReset = (clientId) =>
  apiCall(`/client/reset-password/${clientId}`, "POST");

export const fetchClientPositions = async (clientId) => {
  const response = await fetch(`/api/clients/${clientId}/positions`);

  if (!response.ok) {
    throw new Error("Failed to fetch client positions");
  }
  return response.json();
};
