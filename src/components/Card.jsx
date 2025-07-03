import { Card as BCard, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Productos.css";

function Card({ producto }) {
  return (
    <BCard className="producto-card text-center">
      <Link to={`/productos/${producto.id}`} className="mx-auto mt-3">
        <BCard.Img
          variant="top"
          src={producto.image}
          className="producto-image"
        />
      </Link>
      <BCard.Body className="d-flex flex-column justify-content-between">
        <div>
          <BCard.Title className="text-dark fs-5 mb-2">{producto.name}</BCard.Title>
          <BCard.Text className="text-dark fw-bold mb-3">${producto.price}</BCard.Text>
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
