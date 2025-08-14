import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { Form, Button, Row, Col, Card, InputGroup } from "react-bootstrap";

// Función para generar slug
const generarSlug = (texto) => {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // reemplaza espacios por guiones
    .replace(/[^\w-]+/g, '')    // elimina caracteres no alfanuméricos
    .replace(/^-+|-+$/g, '');   // quita guiones al inicio y final
};

// Formatea números con miles (1.000)
const formatearMiles = (valor) => {
  const limpio = valor.replace(/\D/g, "");
  if (!limpio) return "";
  return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Parsear precio a número
const parsearPrecio = (str) => {
  if (!str) return null;
  const limpio = str.toString().replace(/\./g, "").replace(",", ".");
  const num = parseFloat(limpio);
  return isNaN(num) ? null : num;
};

export default function FormularioProducto({ onProductoAgregado }) {
  const [producto, setProducto] = useState({
    name: "",
    descriptin: "",
    price: "",
    images: "",
    category: "",
  });

  const [talles, setTalles] = useState([{ talle: "", precio: "" }]);
  const [loading, setLoading] = useState(false);

  // Calculamos slug en tiempo real
  const slug = generarSlug(producto.name);

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

  const agregarTalle = () => setTalles([...talles, { talle: "", precio: "" }]);
  const quitarTalle = (index) => setTalles(talles.filter((_, i) => i !== index));

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
        name: producto.name.trim(),
        descriptin: producto.descriptin.trim(),
        price: objetoPrices ? null : precioUnicoLimpio,
        prices: objetoPrices,
        images: imagenesArray,
        category: producto.category || "",
        slug, // ¡slug generado automáticamente!
      };

      console.log("Producto a guardar:", productoAGuardar);

      await addDoc(collection(db, "productos"), productoAGuardar);

      alert("Producto agregado exitosamente");
      setProducto({ name: "", descriptin: "", price: "", images: "", category: "" });
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
    <Card className="mb-4 p-4">
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Control
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={producto.name}
              onChange={handleChange}
              required
            />
            {producto.name && (
              <Form.Text className="text-muted">
                Slug generado: <strong>{slug}</strong>
              </Form.Text>
            )}
          </Col>

          <Col md={6}>
            <Form.Control
              type="text"
              name="descriptin"
              placeholder="Descripción"
              value={producto.descriptin}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={6}>
            <Form.Select
              name="category"
              value={producto.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              <option value="Doboks">Doboks</option>
              <option value="Protecciones">Protecciones</option>
              <option value="Indumentaria">Indumentaria</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Bolsas">Bolsas</option>
              <option value="Elementos de entrenamiento">Elementos de entrenamiento</option>
            </Form.Select>
          </Col>

          {talles.length === 0 && (
            <Col md={6}>
              <Form.Control
                type="text"
                name="price"
                placeholder="Precio único"
                value={producto.price}
                onChange={handleChange}
              />
            </Col>
          )}

          <Col md={6}>
            <Form.Control
              as="textarea"
              rows={2}
              name="images"
              placeholder="URL(s) de imágenes, separadas por coma"
              value={producto.images}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={12}>
            <h5>Precios por talle (opcional)</h5>
            {talles.map((t, index) => (
              <Row key={index} className="mb-2 align-items-center">
                <Col md={5}>
                  <Form.Control
                    type="text"
                    placeholder="Talle (ej: S, M, L)"
                    value={t.talle}
                    onChange={(e) => handleTalleChange(index, "talle", e.target.value)}
                  />
                </Col>
                <Col md={5}>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Precio"
                      value={t.precio}
                      onChange={(e) => handleTalleChange(index, "precio", e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => quitarTalle(index)}
                    style={{ minWidth: "30px" }}
                  >
                    X
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" size="sm" onClick={agregarTalle}>
              Agregar talle
            </Button>
          </Col>

          <Col md={12}>
            <Button type="submit" className="w-100" variant="success" disabled={loading}>
              {loading ? "Agregando..." : "Agregar Producto"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
