import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Admin.css";


function FormularioProducto({ onProductoAgregado }) {
    const [producto, setProducto] = useState({
        name: "",
        descriptin: "",
        price: "",
        image: "",
    });

    const handleChange = (e) => {
        setProducto({ ...producto, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "https://682a8de1ab2b5004cb370219.mockapi.io/Productos",
                producto
            );
            alert("Producto agregado exitosamente");
            setProducto({ name: "", descriptin: "", price: "", image: "" });
            onProductoAgregado();
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Ocurrió un error al agregar el producto");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <input
                type="text"
                name="name"
                placeholder="Nombre del producto"
                value={producto.name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="descriptin"
                placeholder="Descripción"
                value={producto.descriptin}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="price"
                placeholder="Precio"
                value={producto.price}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="image"
                placeholder="URL de la imagen"
                value={producto.image}
                onChange={handleChange}
                required
            />
            <button type="submit">Agregar Producto</button>
        </form>
    );
}

export default function Admin() {
    const [productos, setProductos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 5;

    // Estado para edición:
    const [productoEditandoId, setProductoEditandoId] = useState(null);
    const [productoEditandoDatos, setProductoEditandoDatos] = useState({
        name: "",
        descriptin: "",
        price: "",
        image: "",
    });

    const fetchProductos = async () => {
        try {
            const res = await axios.get(
                "https://682a8de1ab2b5004cb370219.mockapi.io/Productos"
            );
            setProductos(res.data);
        } catch (error) {
            console.error("Error al cargar productos", error);
            alert("No se pudieron cargar los productos");
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const borrarProducto = async (id) => {
        try {
            await axios.delete(
                `https://682a8de1ab2b5004cb370219.mockapi.io/Productos/${id}`
            );
            setProductos(productos.filter((producto) => producto.id !== id));
            alert("Producto borrado correctamente");
        } catch (error) {
            console.error("Error al borrar producto", error);
            alert("No se pudo borrar el producto");
        }
    };

    // Editar producto:
    const iniciarEdicion = (producto) => {
        setProductoEditandoId(producto.id);
        setProductoEditandoDatos({
            name: producto.name,
            descriptin: producto.descriptin,
            price: producto.price,
            image: producto.image,
        });
    };

    const cancelarEdicion = () => {
        setProductoEditandoId(null);
        setProductoEditandoDatos({ name: "", descriptin: "", price: "", image: "" });
    };

    const handleEditChange = (e) => {
        setProductoEditandoDatos({
            ...productoEditandoDatos,
            [e.target.name]: e.target.value,
        });
    };

    const guardarEdicion = async () => {
        try {
            await axios.put(
                `https://682a8de1ab2b5004cb370219.mockapi.io/Productos/${productoEditandoId}`,
                productoEditandoDatos
            );
            alert("Producto actualizado correctamente");
            setProductoEditandoId(null);
            setProductoEditandoDatos({ name: "", descriptin: "", price: "", image: "" });
            fetchProductos();
        } catch (error) {
            console.error("Error al actualizar producto", error);
            alert("No se pudo actualizar el producto");
        }
    };

    const totalPaginas = Math.ceil(productos.length / productosPorPagina);
    const productosMostrados = productos.slice(
        (paginaActual - 1) * productosPorPagina,
        paginaActual * productosPorPagina
    );

    return (
        <div>
            <h1>Panel de Administración</h1>

            <FormularioProducto onProductoAgregado={fetchProductos} />

            <h2>Productos existentes</h2>
            {productos.length === 0 ? (
                <p>No hay productos cargados.</p>
            ) : (
                <>
                    <ul className="producto-lista">
                        {productosMostrados.map((producto) => (
                            <li key={producto.id} className="producto-item">
                                {productoEditandoId === producto.id ? (
                                    <>
                                        <input
                                            type="text"
                                            name="name"
                                            value={productoEditandoDatos.name}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="descriptin"
                                            value={productoEditandoDatos.descriptin}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="price"
                                            value={productoEditandoDatos.price}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="image"
                                            value={productoEditandoDatos.image}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <button
                                            onClick={guardarEdicion}
                                            className="boton-guardar"
                                        >
                                            Guardar
                                        </button>
                                        <button onClick={cancelarEdicion} className="boton-cancelar">
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={producto.image}
                                            alt={producto.name}
                                            className="producto-imagen"
                                        />
                                        <div>
                                            <strong>{producto.name}</strong> - {producto.descriptin} - $
                                            {producto.price}
                                        </div>
                                        <button
                                            onClick={() => iniciarEdicion(producto)}
                                            className="boton-editar"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => borrarProducto(producto.id)}
                                            className="boton-borrar"
                                        >
                                            Borrar
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: "20px" }}>
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPaginaActual(i + 1)}
                                className={`boton-pagina ${paginaActual === i + 1 ? "activo" : ""
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
