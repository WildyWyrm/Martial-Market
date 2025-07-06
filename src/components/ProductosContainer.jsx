import { useEffect, useState } from "react";
import "../styles/Productos.css";
import Card from "./Card";
import { Container, Row, Col, Form } from "react-bootstrap";

function ProductosContainer() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        fetch("https://682a8de1ab2b5004cb370219.mockapi.io/Productos")
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                setProductos(datos);
                setCargando(false);
            })
            .catch((error) => {
                console.log("Error", error);
                setError("Hubo un problema al cargar los productos.");
                setCargando(false);
            });
    }, []);

    const productosFiltrados = productos.filter((producto) =>
        producto.name.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (cargando)
        return (
            <p role="status" aria-live="polite" aria-busy="true">
                Cargando productos...
            </p>
        );

    if (error)
        return (
            <p role="alert" aria-live="assertive" style={{ color: "red" }}>
                {error}
            </p>
        );

    return (
        <main>
            <Container className="my-4" aria-label="Listado de productos">
                {/* Barra de búsqueda */}
                <Form className="mb-4">
                    <Form.Control
                        className="busqueda-input"
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        aria-label="Buscar productos"
                    />
                </Form>

                {/* Productos */}
                {productosFiltrados.length > 0 ? (
                    <ul
                        style={{ listStyleType: "none", paddingLeft: 0 }}
                        aria-label="Resultados de productos filtrados"
                    >
                        <Row className="justify-content-center">
                            {productosFiltrados.map((producto) => (
                                <Col
                                    key={producto.id}
                                    xs={6}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    className="d-flex justify-content-center mb-4"
                                    as="li"
                                >
                                    <Card producto={producto} />
                                </Col>
                            ))}
                        </Row>
                    </ul>
                ) : (
                    <p role="alert" aria-live="assertive">
                        No se encontraron productos.
                    </p>
                )}
            </Container>
        </main>
    );
}

export default ProductosContainer;
