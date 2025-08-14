import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, ButtonGroup, Form } from "react-bootstrap";
import { CarritoContext } from "../contexts/CarritoContext";
import { dispararSweetBasico } from "../assets/SweetAlert";
import { Helmet } from "react-helmet-async";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import "../styles/ProductoDetalle.css";

function ProductoDetalle() {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { slug } = useParams();
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
        const q = query(collection(db, "productos"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          data.id = docSnap.id; // Guardamos el ID real del documento

          if (data.image && !data.images) {
            data.images = data.image.split(",").map((url) => url.trim());
          }

          setProducto(data);
          if (data.images?.length) setImagenPrincipal(data.images[0]);

          if (data.prices && Object.keys(data.prices).length > 0) {
            const talles = Object.keys(data.prices);
            setTalleSeleccionado(talles[0]);
            setPrecioTalle(data.prices[talles[0]]);
          } else {
            setPrecioTalle(data.price || 0);
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
  }, [slug]);

  if (cargando) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto) return null;

  const funcionCarrito = () => {
    if (cantidad < 1) return;
    const productoParaAgregar = {
      ...producto,
      cantidad,
      price: precioTalle,
      talle: talleSeleccionado || "Único",
    };
    dispararSweetBasico("Producto Agregado", "Se agregó al carrito", "success", "Cerrar");
    agregarAlCarrito(productoParaAgregar);
  };

  return (
    <>
      <Helmet>
        <title>{`${producto.name} en Moreno | Martial Market`}</title>
        <meta
          name="description"
          content={`Comprá ${producto.name} (${producto.category}) en Martial Market, Moreno Zona Oeste. ${producto.descriptin?.slice(0, 150)}`}
        />
        <meta
          name="keywords"
          content={`artes marciales, ${producto.name}, ${producto.category}, ${producto?.marca || "granmarc"}, moreno, zona oeste, ${producto.talle || ""}`}
        />
        <meta property="og:title" content={`${producto.name} en Moreno | Martial Market`} />
        <meta
          property="og:description"
          content={`Producto de artes marciales disponible en Moreno, Zona Oeste. ${producto.descriptin?.slice(0, 150)}`}
        />
        <meta property="og:image" content={producto.images?.[0]} />
        <meta property="og:url" content={`https://martial-market.netlify.app/productos/${slug}`} />
        <link rel="canonical" href={`https://martial-market.netlify.app/productos/${slug}`} />
      </Helmet>

      <main>
        <Container className="my-4">
          <Row className="detalle-row p-4 shadow rounded">
            <Col md={6} className="text-center mb-3">
              {imagenPrincipal && (
                <img
                  className="detalle-imagen-principal"
                  src={imagenPrincipal}
                  alt={`Imagen principal de ${producto.name}`}
                />
              )}
              <div className="galeria-imagenes mt-3 d-flex justify-content-center gap-2">
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
              <h2 className="mb-3">{producto.name}</h2>
              <p className="seo-local" style={{ display: "none" }}>
                {producto.name} original de {producto?.marca || "Granmarc"}, disponible en nuestra tienda online ubicada en
                Moreno, Zona Oeste. Especial para practicantes de artes marciales como Taekwon-Do, Karate, MMA, y más.
              </p>

              {producto.category && <p className="text-secondary fw-semibold">Categoría: {producto.category}</p>}
              <p className="text-muted">{producto.descriptin}</p>

              {producto.prices && Object.keys(producto.prices).length > 0 ? (
                <>
                  <Form.Group controlId="selectTalle" className="mb-3">
                    <Form.Label>Talle:</Form.Label>
                    <Form.Select
                      value={talleSeleccionado}
                      onChange={(e) => {
                        const t = e.target.value;
                        setTalleSeleccionado(t);
                        setPrecioTalle(producto.prices[t]);
                      }}
                    >
                      {Object.keys(producto.prices).map((t) => (
                        <option key={t} value={t}>
                          Talle {t}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <h5 className="text-success fw-bold">${Number(precioTalle).toLocaleString("es-AR")}</h5>
                </>
              ) : (
                <h5 className="text-success fw-bold">${Number(producto.price).toLocaleString("es-AR")}</h5>
              )}

              <div className="my-3 d-flex justify-content-center">
                <ButtonGroup>
                  <Button variant="secondary" onClick={() => cantidad > 1 && setCantidad(cantidad - 1)}>
                    -
                  </Button>
                  <Button variant="light" disabled>
                    {cantidad}
                  </Button>
                  <Button variant="secondary" onClick={() => setCantidad(cantidad + 1)}>
                    +
                  </Button>
                </ButtonGroup>
              </div>

              <div className="d-flex gap-3 justify-content-center">
                <Button variant="outline-primary" onClick={() => navigate("/productos")}>
                  Seguir comprando
                </Button>
                <Button variant="primary" onClick={funcionCarrito}>
                  Agregar al carrito
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}

export default ProductoDetalle;
