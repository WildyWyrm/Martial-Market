import { useState } from "react";
import axios from "axios";

export default function FormularioProducto() {
    const [producto, setProducto] = useState({
        name: "",
        descriptin: "",
        price: "",
        image: ""
    });

    const handleChange = (e) => {
        setProducto({ ...producto, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://682a8de1ab2b5004cb370219.mockapi.io/Productos", producto);
            alert("Producto agregado exitosamente");
            setProducto({ name: "", descriptin: "", price: "", image: "" });
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Ocurrió un error al agregar el producto");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
