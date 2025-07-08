import { useState, useContext } from "react";
import { Navbar, Nav, Container, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CarritoContext } from "../contexts/CarritoContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Nav.css";

function NavBar() {
    const { productosCarrito } = useContext(CarritoContext);
    const { user, logout, userRole } = useAuth();
    const esAdmin = userRole === "admin";

    const [expanded, setExpanded] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const cerrarMenu = () => setExpanded(false);

    return (
        <nav role="navigation" aria-label="Navegación principal">
            <Navbar bg="dark" variant="dark" expand="md" className="py-2" expanded={expanded}>
                <Container>
                    <Navbar.Brand as={Link} to="/" onClick={cerrarMenu}>
                        <img
                            src="https://martialmarkets.netlify.app/imagenes/Martial%20Market.png"
                            alt="Logo de Martial Market"
                            className="logo-navbar"
                        />
                    </Navbar.Brand>

                    <div className="position-relative">
                        <Navbar.Toggle
                            aria-controls="navContent"
                            onClick={() => setExpanded(expanded ? false : "expanded")}
                        />
                        {productosCarrito.length > 0 && (
                            <span className="hamburguesa-indicador" aria-hidden="true"></span>
                        )}
                    </div>

                    <Navbar.Collapse id="navContent">
                        <Nav className="mx-auto gap-3" onClick={cerrarMenu}>
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
                            <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
                            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
                        </Nav>

                        <Nav className="ms-auto d-flex align-items-center gap-3" onClick={cerrarMenu}>
                            <Nav.Link as={Link} to="/carrito" className="text-warning position-relative">
                                <i className="fas fa-shopping-cart"></i>
                                {productosCarrito.length > 0 && (
                                    <Badge bg="warning" text="dark" pill className="ms-1">
                                        {productosCarrito.length}
                                    </Badge>
                                )}
                            </Nav.Link>

                            {esAdmin && (
                                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                            )}

                            {user ? (
                                <>
                                    <span className="text-success small">
                                        {user.displayName || user.email}
                                    </span>
                                    <Nav.Link as={Link} to="/perfil">Mi perfil</Nav.Link>
                                    <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </nav>
    );
}

export default NavBar;
