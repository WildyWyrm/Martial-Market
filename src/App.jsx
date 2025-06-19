import { useAuth } from './contexts/AuthContext';
import './App.css';
import Home from './layouts/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import ProductosContainer from './components/ProductosContainer';
import Carrito from './components/Carrito';
import About from './components/About';
import Contacto from './components/Contacto';
import ProductoDetalle from './components/ProductoDetalle';
import Admin from './components/Admin';
import Login2 from './components/Login2';
import Signup from './components/Signup';
import Perfil from "./components/Perfil.jsx";

function App() {
  const { user } = useAuth();
  const esAdmin = user?.email === "brianbasabee@gmail.com";

  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductosContainer />} />
          <Route path="/login" element={<Login2 />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/carrito" element={<Carrito usuarioLogeado={!!user} />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />

          {/* Ruta protegida Admin */}
          <Route path="/admin" element={esAdmin ? <Admin /> : <Navigate to="/login" replace />} />

          {/* Ruta protegida Perfil */}
          <Route path="/perfil" element={user ? <Perfil /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
