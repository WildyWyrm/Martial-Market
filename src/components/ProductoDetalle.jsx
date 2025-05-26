import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- import useNavigate
import "../styles/ProductoDetalle.css";
import { dispararSweetBasico } from "../assets/SweetAlert";
import { CarritoContext } from "../contexts/CarritoContext";

function ProductoDetalle({}) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { id } = useParams();
  const navigate = useNavigate(); // <-- instancia

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://682a8de1ab2b5004cb370219.mockapi.io/Productos")
      .then((res) => res.json())
      .then((datos) => {
        const productoEncontrado = datos.find((item) => item.id === id);
        if (productoEncontrado) {
          setProducto(productoEncontrado);
        } else {
          setError("Producto no encontrado.");
        }
        setCargando(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        setError("Hubo un error al obtener el producto.");
        setCargando(false);
      });
  }, [id]);

  function funcionCarrito() {
    if (cantidad < 1) return;
    dispararSweetBasico(
      "Producto Agregado",
      "El producto fue agregado al carrito con éxito",
      "success",
      "Cerrar"
    );
    agregarAlCarrito({ ...producto, cantidad });
  }

  function seguirComprando() {
    navigate("/productos"); // Navega a la página productos
  }

  function sumarContador() {
    setCantidad(cantidad + 1);
  }

  function restarContador() {
    if (cantidad > 1) setCantidad(cantidad - 1);
  }

  if (cargando) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;
  if (!producto) return null;

  return (
    <div className="detalle-container">
      <img className="detalle-imagen" src={producto.image} alt={producto.name} />

      <div className="detalle-info">
        <h2>{producto.name}</h2>
        <p>{producto.descriptin}</p>
        <p>{producto.price} $</p>

        <div className="detalle-contador" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={restarContador}>-</button>
          <span>{cantidad}</span>
          <button onClick={sumarContador}>+</button>

          <button onClick={seguirComprando} style={{ marginLeft: "20px" }}>
            Seguir comprando
          </button>
        </div>

        <button onClick={funcionCarrito}>Agregar al carrito</button>
      </div>
    </div>
  );
}

export default ProductoDetalle;
