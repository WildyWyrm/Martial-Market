import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

// Función para formatear número con puntos de miles
const formatearMiles = (valor) => {
  // Eliminar todo lo que no sea número
  const limpio = valor.replace(/\D/g, "");
  if (!limpio) return "";
  // Poner puntos cada 3 dígitos
  return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function FormularioProducto({ onProductoAgregado }) {
  const [producto, setProducto] = useState({
    name: "",
    descriptin: "",
    price: "",
    image: "",
  });

  const [talles, setTalles] = useState([{ talle: "", precio: "" }]);
  const [loading, setLoading] = useState(false);

  // Maneja cambios en inputs básicos (name, descriptin, image, price)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      // Formatear visualmente el precio único con puntos
      setProducto({ ...producto, price: formatearMiles(value) });
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  // Maneja cambios en talles y precios
  const handleTalleChange = (index, field, value) => {
    const nuevosTalles = [...talles];
    if (field === "precio") {
      nuevosTalles[index][field] = formatearMiles(value);
    } else {
      nuevosTalles[index][field] = value;
    }
    setTalles(nuevosTalles);
  };

  const agregarTalle = () => {
    setTalles([...talles, { talle: "", precio: "" }]);
  };

  const quitarTalle = (index) => {
    const nuevosTalles = talles.filter((_, i) => i !== index);
    setTalles(nuevosTalles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtrar talles válidos y limpiar puntos
      const tallesValidos = talles.filter(
        (t) =>
          t.talle.trim() !== "" &&
          t.precio !== "" &&
          !isNaN(parseInt(t.precio.toString().replace(/\./g, "")))
      );

      const objetoPrices =
        tallesValidos.length > 0
          ? tallesValidos.reduce((acc, curr) => {
const precioLimpio = parseFloat(
  curr.precio.toString().replace(/\./g, "").replace(",", ".")
);

              acc[curr.talle.trim()] = precioLimpio;
              return acc;
            }, {})
          : null;

      const precioUnicoLimpio = producto.price
        ? parseInt(producto.price.toString().replace(/\./g, ""))
        : null;

      const productoAGuardar = {
        name: producto.name,
        descriptin: producto.descriptin,
        price: objetoPrices ? null : precioUnicoLimpio,
        prices: objetoPrices,
        image: producto.image,
      };

      console.log("Producto a guardar:", productoAGuardar);

      await addDoc(collection(db, "productos"), productoAGuardar);

      alert("Producto agregado exitosamente");
      setProducto({ name: "", descriptin: "", price: "", image: "" });
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
          <label htmlFor="price">Precio único (dejar vacío si hay talles)</label>
          <input
            id="price"
            type="text"
            name="price"
            placeholder="Precio único"
            value={producto.price}
            onChange={handleChange}
            disabled={talles.some(
              (t) => t.talle.trim() !== "" && t.precio !== ""
            )}
          />
        </div>

        <fieldset>
          <legend>Precios por talle (opcional)</legend>
          {talles.map((talleObj, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Talle"
                value={talleObj.talle}
                onChange={(e) =>
                  handleTalleChange(index, "talle", e.target.value)
                }
                aria-label={`Talle ${index + 1}`}
              />
              <input
                type="text"
                placeholder="Precio"
                value={talleObj.precio}
                onChange={(e) =>
                  handleTalleChange(index, "precio", e.target.value)
                }
                aria-label={`Precio para talle ${index + 1}`}
              />
              {talles.length > 1 && (
                <button
                  type="button"
                  onClick={() => quitarTalle(index)}
                  aria-label={`Quitar talle ${index + 1}`}
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={agregarTalle}>
            Agregar talle
          </button>
        </fieldset>

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

        <button type="submit" disabled={loading}>
          {loading ? "Agregando..." : "Agregar Producto"}
        </button>
      </form>
    </section>
  );
}
