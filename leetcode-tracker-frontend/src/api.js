import axios from 'axios';

export default axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});