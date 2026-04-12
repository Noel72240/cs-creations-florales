import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SiteContentProvider } from './context/SiteContentContext'
import { CartProvider } from './context/CartContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteContentProvider>
      <CartProvider>
        <CustomerAuthProvider>
          <App />
        </CustomerAuthProvider>
      </CartProvider>
    </SiteContentProvider>
  </React.StrictMode>,
)
