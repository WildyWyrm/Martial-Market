import "../styles/CarritoCard.css"

function CarritoCard({producto, funcionDisparadora}){
    
    function borrarDelCarrito() {
        funcionDisparadora(producto.id);
    }


    const precioNumerico = Number(
        String(producto.price).replace(/\./g, '').replace(',', '.')
    );

    const subtotal = precioNumerico * producto.cantidad;

    return (
        <div className="carrito-card">
            <h3 className="carrito-producto" style={{color:"black"}}>{producto.name}</h3>
            <p className="descripcion-carrito" style={{color:"black"}}>{producto.descriptin}</p>
            <img className="carrito-image" src={producto.image} alt={producto.name} />
            <span style={{color:"black"}}>{producto.cantidad}</span>
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
            >
                X
            </button>
        </div>
    );
}

export default CarritoCard;
