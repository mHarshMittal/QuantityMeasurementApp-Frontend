import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1c2330',
            color: '#e6edf3',
            border: '1px solid #30363d',
            borderRadius: '8px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#3fb950', secondary: '#1c2330' } },
          error:   { iconTheme: { primary: '#f85149', secondary: '#1c2330' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
