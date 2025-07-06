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
        <section aria-label="Formulario para agregar productos">
            <h2>Agregar nuevo producto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre del producto</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Nombre del producto"
                        value={producto.name}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label htmlFor="descriptin">Descripción</label>
                    <input
                        id="descriptin"
                        type="text"
                        name="descriptin"
                        placeholder="Descripción"
                        value={producto.descriptin}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label htmlFor="price">Precio</label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        placeholder="Precio"
                        value={producto.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <div>
                    <label htmlFor="image">URL de la imagen</label>
                    <input
                        id="image"
                        type="url"
                        name="image"
                        placeholder="URL de la imagen"
                        value={producto.image}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Agregar Producto</button>
            </form>
        </section>
    );
}
