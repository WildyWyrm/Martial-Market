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

    if (cargando) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container className="my-4">
            {/* Barra de búsqueda */}
            <Form className="mb-4">
                <Form.Control
                    className="busqueda-input"
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </Form>

            {/* Productos */}
            <Row className="justify-content-center">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                        <Col
                            key={producto.id}
                            xs={6}   // 2 por fila en mobile
                            sm={6}   // 2 por fila en tablets pequeñas
                            md={4}   // 3 por fila en tablets grandes
                            lg={3}   // 4 por fila en desktop
                            className="d-flex justify-content-center mb-4"
                        >
                            <Card producto={producto} />
                        </Col>
                    ))
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </Row>
        </Container>
    );
}

export default ProductosContainer;
