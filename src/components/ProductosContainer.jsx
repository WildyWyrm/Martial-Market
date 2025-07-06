import { useEffect, useState } from "react";
import "../styles/Productos.css";
import Card from "./Card";
import { Container, Row, Col, Form, Pagination } from "react-bootstrap";

function ProductosContainer() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 8;

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

    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const productosMostrados = productosFiltrados.slice(
        (paginaActual - 1) * productosPorPagina,
        paginaActual * productosPorPagina
    );

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setPaginaActual(1); // Volver a página 1 al buscar
    };

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
                        onChange={handleBusquedaChange}
                        aria-label="Buscar productos"
                    />
                </Form>

                {/* Productos */}
                {productosFiltrados.length > 0 ? (
                    <>
                        <ul
                            style={{ listStyleType: "none", paddingLeft: 0 }}
                            aria-label="Resultados de productos filtrados"
                        >
                            <Row className="justify-content-center">
                                {productosMostrados.map((producto) => (
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

                        {/* Paginación */}
                        <Pagination className="justify-content-center mt-3 pb-4">
                            {Array.from({ length: totalPaginas }, (_, i) => (
                                <Pagination.Item
                                    key={i}
                                    active={paginaActual === i + 1}
                                    onClick={() => setPaginaActual(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </>
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
