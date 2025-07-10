import { Card as BCard, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Productos.css";

function formatearPrecio(precio) {
  const tieneDecimales = precio % 1 !== 0;
  return precio.toLocaleString("es-AR", {
    minimumFractionDigits: tieneDecimales ? 2 : 0,
    maximumFractionDigits: 3,
  });
}

function Card({ producto }) {
  let precioMostrar;

  if (producto.prices) {
    const precios = Object.values(producto.prices);
    const precioMinimo = Math.min(...precios);
    precioMostrar = precioMinimo;
  } else {
    precioMostrar = producto.price;
  }

  return (
    <BCard as="article" className="producto-card text-center">
      <Link to={`/productos/${producto.id}`} className="mx-auto mt-3">
        <BCard.Img
          variant="top"
          src={producto.image}
          alt={`Imagen del producto ${producto.name}`}
          className="producto-image"
        />
      </Link>
      <BCard.Body className="d-flex flex-column justify-content-between">
        <div>
          <BCard.Title as="h3" className="text-dark fs-5 mb-2">
            {producto.name}
          </BCard.Title>
          <BCard.Text className="text-dark fw-bold mb-3">
            ${formatearPrecio(parseFloat(precioMostrar))}
          </BCard.Text>
        </div>
        <Link to={`/productos/${producto.id}`}>
          <Button
            style={{
              backgroundColor: "#2a82da",
              borderColor: "#2a82da",
              boxShadow: "0 4px 8px rgba(42, 130, 218, 0.4)",
              borderRadius: "20px",
            }}
            size="sm"
          >
            Ver detalles del producto
          </Button>
        </Link>
      </BCard.Body>
    </BCard>
  );
}

export default Card;
