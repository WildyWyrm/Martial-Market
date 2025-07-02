import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarritoProvider } from './contexts/CarritoContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
/* Acabo de aplicar bootstrap lo que tengo que hacer es pasar mis 
componentes al chatgpt y decirle que lo adapte  
a boostrap responsive lo mas posible
y tambien le tengo que pasar mis .css */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </AuthProvider>
  </StrictMode>,
)
