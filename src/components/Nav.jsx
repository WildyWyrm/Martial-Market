import { useContext } from "react";
import { Link } from "react-router-dom";
import { CarritoContext } from "../contexts/CarritoContext";
import { useAuth } from "../contexts/AuthContext";

function Nav() {
    const { productosCarrito } = useContext(CarritoContext);
    const { user, logout } = useAuth();

    const esAdmin = user?.email === "brianbasabee@gmail.com";

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <nav style={{ backgroundColor: "#333", color: "white", padding: "10px", width: "100%" }}>
            <ul style={{ listStyle: "none", display: "flex", justifyContent: "space-around", margin: 0, alignItems: "center" }}>
                <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Inicio</Link></li>
                <li><Link to="/productos" style={{ color: "white", textDecoration: "none" }}>Productos</Link></li>
                <li><Link to="/nosotros" style={{ color: "white", textDecoration: "none" }}>Nosotros</Link></li>
                <li><Link to="/contacto" style={{ color: "white", textDecoration: "none" }}>Contacto</Link></li>
                <li><Link to="/carrito" style={{ color: "white", textDecoration: "none" }}>
                    Carrito {productosCarrito.length > 0 && <span>({productosCarrito.length})</span>}
                </Link></li>

                {esAdmin && (
                    <li><Link to="/admin" style={{ color: "white", textDecoration: "none" }}>Admin</Link></li>
                )}

                {user ? (
                    <>
                        <li style={{ color: "lightgreen" }}>
                            {user.displayName || user.email}
                        </li>
                        <li>
                            <Link to="/perfil" style={{ color: "white", textDecoration: "underline" }}>
                                Mi perfil
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} style={{ background: "none", color: "white", border: "none", cursor: "pointer" }}>
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <li><Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
