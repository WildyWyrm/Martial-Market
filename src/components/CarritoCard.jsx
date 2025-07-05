import "../styles/CarritoCard.css"

function CarritoCard({ producto, funcionDisparadora }) {
    
    function borrarDelCarrito() {
        funcionDisparadora(producto.id);
    }

    const precioNumerico = Number(
        String(producto.price).replace(/\./g, '').replace(',', '.')
    );

    const subtotal = precioNumerico * producto.cantidad;

    return (
        <article className="carrito-card" aria-label={`Producto ${producto.name} en el carrito`}>
            <h3 className="carrito-producto" style={{color:"black"}}>{producto.name}</h3>
            <p className="descripcion-carrito" style={{color:"black"}}>{producto.descriptin}</p>
            <img 
                className="carrito-image" 
                src={producto.image} 
                alt={`Imagen de ${producto.name}`} 
            />
            <span style={{color:"black"}} aria-label={`Cantidad: ${producto.cantidad}`}>
                {producto.cantidad}
            </span>
            <div className="carrito-unitario">
                <span style={{color:"black"}}>
                    ${precioNumerico.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
            </div>
            <div className="carrito-sub">
                <span style={{color:"black"}}>
                    ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
            </div>
            <button
                className="boton-carrito"
                onClick={borrarDelCarrito}
                style={{
                    backgroundColor: "rgb(21, 131, 54)",
                    color: "black",
                    cursor: "pointer"
                }}
                aria-label={`Quitar ${producto.name} del carrito`}
            >
                X
            </button>
        </article>
    );
}

export default CarritoCard;
