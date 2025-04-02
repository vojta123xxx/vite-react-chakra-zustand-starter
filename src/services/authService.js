import axios from "axios";

const API_URL = "http://localhost:5000/";

// Registrace uživatele
export const register = async (email, password) => {
  return axios.post(`${API_URL}auth/register`, { email, password });
};

// Přihlášení uživatele (cookie se nastaví na straně serveru)
export const login = async (email, password) => {
  return axios.post(
    `${API_URL}auth/login`,
    { email, password },
    { withCredentials: true }
  );
};

// Ověření uživatele (volitelné – dle logiky backendu)
export const verify = async (email) => {
  return axios.post(`${API_URL}auth/verify`, { email });
};

// Obnovení tokenu (volitelné)
export const renewToken = async (token) => {
  return axios.post(`${API_URL}auth/renew`, { token });
};

// Funkce pro získání dat přihlášeného uživatele
export const getProfile = async () => {
  return axios.get(`${API_URL}auth/profile`, {
    withCredentials: true,
  });
};
