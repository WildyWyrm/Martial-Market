import React, { createContext, useState } from 'react';

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
    const [productosCarrito, setProductosCarrito] = useState([]);

    const agregarAlCarrito = (productoNuevo) => {
        const existe = productosCarrito.find(p =>
            p.id === productoNuevo.id && p.talle === productoNuevo.talle
        );

        if (existe) {
            const carritoActualizado = productosCarrito.map((p) => {
                if (p.id === productoNuevo.id && p.talle === productoNuevo.talle) {
                    return { ...p, cantidad: p.cantidad + productoNuevo.cantidad };
                } else {
                    return p;
                }
            });
            setProductosCarrito(carritoActualizado);
        } else {
            const nuevoCarrito = [...productosCarrito, productoNuevo];
            setProductosCarrito(nuevoCarrito);
        }
    };

    const vaciarCarrito = () => {
        setProductosCarrito([]);
    };

    const borrarProductoCarrito = (id, talle) => {
        const nuevoCarrito = productosCarrito.filter(
            (p) => !(p.id === id && p.talle === talle)
        );
        setProductosCarrito(nuevoCarrito);
    };

    return (
        <CarritoContext.Provider
            value={{
                productosCarrito,
                agregarAlCarrito,
                vaciarCarrito,
                borrarProductoCarrito
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
}
