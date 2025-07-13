import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const formatearMiles = (valor) => {
  const limpio = valor.replace(/\D/g, "");
  if (!limpio) return "";
  return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function FormularioProducto({ onProductoAgregado }) {
  const [producto, setProducto] = useState({
    name: "",
    descriptin: "",
    price: "",
    images: "",
  });

  const [talles, setTalles] = useState([{ talle: "", precio: "" }]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      setProducto({ ...producto, price: formatearMiles(value) });
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  const handleTalleChange = (index, field, value) => {
    const nuevosTalles = [...talles];
    nuevosTalles[index][field] = field === "precio" ? formatearMiles(value) : value;
    setTalles(nuevosTalles);
  };

  const agregarTalle = () => {
    setTalles([...talles, { talle: "", precio: "" }]);
  };

  const quitarTalle = (index) => {
    setTalles(talles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tallesValidos = talles.filter(
        (t) =>
          t.talle.trim() !== "" &&
          t.precio !== "" &&
          !isNaN(parseInt(t.precio.toString().replace(/\./g, "")))
      );

      const objetoPrices = tallesValidos.length > 0
        ? tallesValidos.reduce((acc, curr) => {
            const precioLimpio = parseFloat(curr.precio.replace(/\./g, "").replace(",", "."));
            acc[curr.talle.trim()] = precioLimpio;
            return acc;
          }, {})
        : null;

      const precioUnicoLimpio = producto.price
        ? parseInt(producto.price.toString().replace(/\./g, ""))
        : null;

      const imagenesArray = producto.images
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "");

      const productoAGuardar = {
        name: producto.name,
        descriptin: producto.descriptin,
        price: objetoPrices ? null : precioUnicoLimpio,
        prices: objetoPrices,
        images: imagenesArray,
      };

      await addDoc(collection(db, "productos"), productoAGuardar);

      alert("Producto agregado exitosamente");
      setProducto({ name: "", descriptin: "", price: "", images: "" });
      setTalles([{ talle: "", precio: "" }]);
      if (onProductoAgregado) onProductoAgregado();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Ocurrió un error al agregar el producto");
    } finally {
      setLoading(false);
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
          />
        </div>

        <div>
          <label htmlFor="price">Precio único (dejar vacío si hay talles)</label>
          <input
            id="price"
            type="text"
            name="price"
            placeholder="Precio único"
            value={producto.price}
            onChange={handleChange}
            disabled={talles.some(t => t.talle.trim() !== "" && t.precio !== "")}
          />
        </div>

        <fieldset>
          <legend>Precios por talle (opcional)</legend>
          {talles.map((talleObj, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Talle"
                value={talleObj.talle}
                onChange={(e) => handleTalleChange(index, "talle", e.target.value)}
              />
              <input
                type="text"
                placeholder="Precio"
                value={talleObj.precio}
                onChange={(e) => handleTalleChange(index, "precio", e.target.value)}
              />
              {talles.length > 1 && (
                <button type="button" onClick={() => quitarTalle(index)}>Quitar</button>
              )}
            </div>
          ))}
          <button type="button" onClick={agregarTalle}>Agregar talle</button>
        </fieldset>

        <div>
          <label htmlFor="images">URLs de imágenes (separadas por coma)</label>
          <textarea
            id="images"
            name="images"
            placeholder="https://img1.jpg, https://img2.jpg"
            value={producto.images}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Agregando..." : "Agregar Producto"}
        </button>
      </form>
    </section>
  );
}
