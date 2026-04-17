import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'


if (import.meta.env.DEV) {
  axios.defaults.baseURL = 'http://localhost:5000';
} else {
  // Put your exact Render URL here (Make sure there is NO slash at the end)
  axios.defaults.baseURL = 'https://itss-backend-upy6.onrender.com';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)