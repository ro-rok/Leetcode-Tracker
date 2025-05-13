import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster />
    <App />
    <Analytics />
  </React.StrictMode>
);
