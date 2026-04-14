import axios from 'axios';

const api = axios.create({
  // Use /api as base in production (routed by vercel.json)
  // Use http://localhost:5000/api in development
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;
