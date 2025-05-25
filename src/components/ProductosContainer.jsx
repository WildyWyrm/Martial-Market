import { useEffect, useState } from "react"
import "../styles/Productos.css"
import Card from "./Card"

function ProductosContainer({functionCarrito}){
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    {useEffect(() => {
        fetch('https://682a8de1ab2b5004cb370219.mockapi.io/Productos')
        /* esta es la del profe -> https://68100d8b27f2fdac24101ef5.mockapi.io/productos */
            .then((respuesta) =>
                respuesta.json()
            )
            .then((datos) => {
                console.log(datos)
                setProductos(datos)
                setCargando(false);
            })
            .catch((error) => {
                console.log("Error", error)
                setError('Hubo un problema al cargar los productos.');
                setCargando(false);
            });
    }, []);}


    if (cargando) {
        return <p>Cargando productos...</p>;
    }else if (error){
        return <p>{error}</p>;
    }else{
        return(
            <div className="productos-conteiner">
                {productos.map((producto) => (
                    <Card
                        producto={producto}
                    />
                ))}
            </div>
        )
    }

    
}

export default ProductosContainer

