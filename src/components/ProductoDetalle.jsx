import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, ButtonGroup, Form } from "react-bootstrap";
import { CarritoContext } from "../contexts/CarritoContext";
import { dispararSweetBasico } from "../assets/SweetAlert";
import { Helmet } from "react-helmet-async";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import "../styles/ProductoDetalle.css";

function ProductoDetalle() {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [talleSeleccionado, setTalleSeleccionado] = useState("");
  const [precioTalle, setPrecioTalle] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  async function fetchProducto() {
    try {
      const docRef = doc(db, "productos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        // ✅ Conversión del campo image (string) a images (array), si es necesario
        if (data.image && !data.images) {
          data.images = data.image.split(",").map((url) => url.trim());
        }

        setProducto(data);

        if (data.images?.length) {
          setImagenPrincipal(data.images[0]);
        }

        if (data.prices) {
          const talles = Object.keys(data.prices);
          setTalleSeleccionado(talles[0]);
          setPrecioTalle(data.prices[talles[0]]);
        } else {
          setPrecioTalle(data.price);
        }
      } else {
        setError("Producto no encontrado.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Hubo un error al obtener el producto.");
    } finally {
      setCargando(false);
    }
  }

  fetchProducto();
}, [id]);


  const funcionCarrito = () => {
    if (cantidad < 1) return;

    const productoParaAgregar = {
      ...producto,
      id,
      cantidad,
      price: precioTalle,
      talle: talleSeleccionado || "Único",
    };

    dispararSweetBasico(
      "Producto Agregado",
      "El producto fue agregado al carrito con éxito",
      "success",
      "Cerrar"
    );

    agregarAlCarrito(productoParaAgregar);
  };

  const seguirComprando = () => {
    navigate("/productos");
  };

  const sumarContador = () => {
    setCantidad((prev) => prev + 1);
  };

  const restarContador = () => {
    if (cantidad > 1) setCantidad((prev) => prev - 1);
  };

  const handleTalleChange = (e) => {
    const nuevoTalle = e.target.value;
    setTalleSeleccionado(nuevoTalle);
    setPrecioTalle(producto.prices[nuevoTalle]);
  };

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
        <meta
          name="description"
          content={producto.descriptin?.slice(0, 150)}
        />
        <meta property="og:title" content={producto.name} />
        <meta
          property="og:description"
          content={producto.descriptin?.slice(0, 150)}
        />
        <meta property="og:image" content={producto.images?.[0]} />
        <meta
          property="og:url"
          content={`https://martial-market.netlify.app/productos/${id}`}
        />
        <link
          rel="canonical"
          href={`https://martial-market.netlify.app/productos/${id}`}
        />
      </Helmet>

      <main>
        <Container className="my-4">
          <section
            className="detalle-row p-4 shadow rounded"
            aria-label={`Detalle del producto ${producto.name}`}
          >
            <Row>
              <Col md={6} className="text-center mb-3">
                {imagenPrincipal && (
                  <img
                    className="detalle-imagen-principal"
                    src={imagenPrincipal}
                    alt={`Imagen principal de ${producto.name}`}
                  />
                )}

                <div className="galeria-imagenes mt-3 d-flex justify-content-center flex-wrap gap-2">
                  {producto.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${producto.name} imagen ${idx + 1}`}
                      className="imagen-miniatura"
                      onClick={() => setImagenPrincipal(img)}
                    />
                  ))}
                </div>
              </Col>

              <Col md={6} className="detalle-info">
                <h2 tabIndex={0} className="mb-3">
                  {producto.name}
                </h2>
                <p className="text-muted">{producto.descriptin}</p>

                {producto.prices ? (
                  <>
                    <Form.Group controlId="selectTalle" className="mb-3">
                      <Form.Label>Seleccionar talle:</Form.Label>
                      <Form.Select
                        value={talleSeleccionado}
                        onChange={handleTalleChange}
                        aria-label="Seleccionar talle"
                      >
                        {Object.keys(producto.prices).map((talle) => (
                          <option key={talle} value={talle}>
                            Talle {talle}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <h5 className="text-success fw-bold">
                      ${Number(precioTalle).toLocaleString("es-AR")}
                    </h5>
                  </>
                ) : (
                  <h5 className="text-success fw-bold">
                    ${Number(producto.price).toLocaleString("es-AR")}
                  </h5>
                )}

                <div className="my-3 d-flex justify-content-center">
                  <ButtonGroup aria-label="Control de cantidad del producto">
                    <Button
                      variant="secondary"
                      onClick={restarContador}
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </Button>
                    <Button variant="light" disabled>
                      {cantidad}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={sumarContador}
                      aria-label="Aumentar cantidad"
                    >
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
          </section>
        </Container>
      </main>
    </>
  );
}

export default ProductoDetalle;
