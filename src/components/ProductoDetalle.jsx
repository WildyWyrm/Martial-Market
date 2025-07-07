import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { CarritoContext } from "../contexts/CarritoContext";
import { dispararSweetBasico } from "../assets/SweetAlert";
import { Helmet } from "react-helmet-async";
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
        console.error("Error:", err);
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

  if (cargando)
    return (
      <p role="status" aria-live="polite" aria-busy="true">
        Cargando producto...
      </p>
    );

  if (error)
    return (
      <p role="alert" aria-live="assertive" style={{ color: "red" }}>
        {error}
      </p>
    );

  if (!producto) return null;

  return (
    <>
      <Helmet>
        <title>{producto.name} | Martial Market</title>
        <meta name="description" content={producto.descriptin?.slice(0, 150)} />
        <meta property="og:title" content={producto.name} />
        <meta property="og:description" content={producto.descriptin?.slice(0, 150)} />
        <meta property="og:image" content={producto.image} />
        <meta property="og:url" content={`https://martial-market.netlify.app/productos/${producto.id}`} />
        <link rel="canonical" href={`https://martial-market.netlify.app/productos/${producto.id}`} />
      </Helmet>

      <main>
        <Container className="my-4">
          <section
            className="detalle-row p-4 shadow rounded"
            aria-label={`Detalle del producto ${producto.name}`}
          >
            <Row>
              <Col md={6} className="text-center mb-3">
                <img
                  className="detalle-imagen"
                  src={producto.image}
                  alt={`Imagen del producto ${producto.name}`}
                />
              </Col>

              <Col md={6} className="detalle-info">
                <h2 tabIndex={0} className="mb-3">
                  {producto.name}
                </h2>
                <p className="text-muted">{producto.descriptin}</p>
                <h5 className="text-success fw-bold">${producto.price}</h5>

                <div className="my-3 d-flex justify-content-center">
                  <ButtonGroup aria-label="Control de cantidad del producto">
                    <Button variant="secondary" onClick={restarContador} aria-label="Disminuir cantidad">-</Button>
                    <Button variant="light" disabled>{cantidad}</Button>
                    <Button variant="secondary" onClick={sumarContador} aria-label="Aumentar cantidad">+</Button>
                  </ButtonGroup>
                </div>

                <div className="d-flex gap-3 justify-content-center">
                  <Button variant="outline-primary" onClick={seguirComprando}>Seguir comprando</Button>
                  <Button variant="primary" onClick={funcionCarrito}>Agregar al carrito</Button>
                </div>
              </Col>
            </Row>
          </section>
        </Container>
      </main>
    </>
  );
}

export default ProductoDetalle;
