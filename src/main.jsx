import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SiteContentProvider } from './context/SiteContentContext'
import { CartProvider } from './context/CartContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteContentProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </SiteContentProvider>
  </React.StrictMode>,
)
