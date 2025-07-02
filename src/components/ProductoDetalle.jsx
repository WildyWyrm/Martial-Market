import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { CarritoContext } from "../contexts/CarritoContext";
import { dispararSweetBasico } from "../assets/SweetAlert";
import "../styles/ProductoDetalle.css";

function ProductoDetalle() {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { id } = useParams();
  const navigate = useNavigate();

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
    navigate("/productos");
  }

  function sumarContador() {
    setCantidad((prev) => prev + 1);
  }

  function restarContador() {
    if (cantidad > 1) setCantidad((prev) => prev - 1);
  }

  if (cargando) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;
  if (!producto) return null;

  return (
    <Container className="my-4">
      <Row className="detalle-row p-4 shadow rounded">
        <Col md={6} className="text-center mb-3">
          <img
            className="detalle-imagen"
            src={producto.image}
            alt={producto.name}
          />
        </Col>

        <Col md={6} className="detalle-info">
          <h2 className="mb-3">{producto.name}</h2>
          <p className="text-muted">{producto.descriptin}</p>
          <h5 className="text-success fw-bold">${producto.price}</h5>

          {/* Contador centrado */}
          <div className="my-3 d-flex justify-content-center">
            <ButtonGroup aria-label="Contador cantidad">
              <Button variant="secondary" onClick={restarContador}>
                -
              </Button>
              <Button variant="light" disabled>
                {cantidad}
              </Button>
              <Button variant="secondary" onClick={sumarContador}>
                +
              </Button>
            </ButtonGroup>
          </div>

          <div className="d-flex gap-3 justify-content-center">
            <Button variant="outline-primary" onClick={seguirComprando}>
              Seguir comprando
            </Button>
            <Button variant="primary" onClick={funcionCarrito}>
              Agregar al carrito
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductoDetalle;
