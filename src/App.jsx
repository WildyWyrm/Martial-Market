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
import NotFound from "./components/NotFound";

function App() {
  const { user, userRole } = useAuth();
  const esAdmin = userRole === "admin";

  return (
    <Router>
      <>
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
          <Route path="/admin" element={esAdmin ? <Admin /> : <Navigate to="/login" replace />} />
          <Route path="/perfil" element={user ? <Perfil /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
