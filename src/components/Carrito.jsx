import "../styles/Carrito.css";
import { useContext } from "react";
import CarritoCard from "./CarritoCard.jsx";
import { Navigate } from "react-router-dom";
import { CarritoContext } from "../contexts/CarritoContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Carrito() {
    const { user } = useAuth();
    const { productosCarrito, vaciarCarrito, borrarProductoCarrito } = useContext(CarritoContext);

    const total = productosCarrito.reduce((subTotal, producto) => {
        const precioNumerico = Number(
            String(producto.price).replace(/\./g, '').replace(',', '.')
        );
        return subTotal + precioNumerico * producto.cantidad;
    }, 0);

    function funcionDisparadora(id) {
        borrarProductoCarrito(id);
    }

    function funcionDisparadora2() {
        vaciarCarrito();
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="carrito-conteiner">
            {productosCarrito.length > 0 && (
                <button onClick={funcionDisparadora2}>Vaciar carrito</button>
            )}

            <div className="carrito-titulos">
                <span></span>
                <h2 className="carrito-titulo-producto">Producto</h2>
                <h2 className="carrito-titulo-descripcion">Descripción</h2>
                <h2></h2>
                <h2>Cantidad</h2>
                <h2>Precio unitario</h2>
                <h2>Sub total</h2>
                <h2></h2>
            </div>

            {productosCarrito.length > 0 ? (
                productosCarrito.map((producto) => (
                    <CarritoCard 
                        key={producto.id}
                        producto={producto}
                        funcionDisparadora={funcionDisparadora}
                    />
                ))
            ) : (
                <p>Carrito vacío</p>
            )}

            {productosCarrito.length > 0 && (
                <span className="carrito-vacio">
                    Total a pagar: $ {total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            )}
        </div>
    );
}
