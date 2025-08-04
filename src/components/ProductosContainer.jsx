import { useEffect, useState } from "react";
import "../styles/Productos.css";
import Card from "./Card";
import {
    Container,
    Row,
    Col,
    Form,
    Pagination,
    InputGroup,
} from "react-bootstrap";
import { db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function ProductosContainer() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 8;

    useEffect(() => {
        async function fetchProductos() {
            try {
                const productosCol = collection(db, "productos");
                const snapshot = await getDocs(productosCol);
                const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProductos(lista);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                setError("Hubo un problema al cargar los productos.");
            } finally {
                setCargando(false);
            }
        }
        fetchProductos();
    }, []);

    const categorias = ["Todos", ...new Set(productos.map(p => p.category).filter(Boolean))];

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setPaginaActual(1);
    };

    const handleCategoriaChange = (value) => {
        setCategoriaSeleccionada(value);
        setPaginaActual(1);
    };

    const productosFiltrados = productos.filter((producto) => {
        const coincideBusqueda = producto.name.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria =
            categoriaSeleccionada === "Todos" || producto.category === categoriaSeleccionada;
        return coincideBusqueda && coincideCategoria;
    });

    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const productosMostrados = productosFiltrados.slice(
        (paginaActual - 1) * productosPorPagina,
        paginaActual * productosPorPagina
    );

    if (cargando) {
        return (
            <p role="status" aria-live="polite" aria-busy="true">
                Cargando productos...
            </p>
        );
    }

    if (error) {
        return (
            <p role="alert" aria-live="assertive" style={{ color: "red" }}>
                {error}
            </p>
        );
    }

    return (
        <main>
            <Container className="my-4" aria-label="Listado de productos">
                {/* Filtros: búsqueda y categoría */}
                <Row className="mb-4">
                    <Col md={6} className="mb-2">
                        <InputGroup>
                            <InputGroup.Text>
                                <i className="bi bi-search" aria-hidden="true"></i>
                            </InputGroup.Text>
                            <Form.Control
                                className="busqueda-input"
                                type="text"
                                placeholder="Buscar productos..."
                                value={busqueda}
                                onChange={handleBusquedaChange}
                                aria-label="Buscar productos"
                            />
                        </InputGroup>
                    </Col>
                    <Col md={6} className="mb-2">
                        <Form.Select
                            className="categoria-select"
                            value={categoriaSeleccionada}
                            onChange={(e) => handleCategoriaChange(e.target.value)}
                            aria-label="Filtrar por categoría"
                        >
                            {categorias.map((cat, i) => (
                                <option key={i} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Form.Select>

                    </Col>
                </Row>

                {/* Productos */}
                {productosFiltrados.length > 0 ? (
                    <>
                        <ul style={{ listStyleType: "none", paddingLeft: 0 }} aria-label="Resultados de productos filtrados">
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
                        <Pagination className="justify-content-center mt-3 pb-4 flex-wrap">
                            {/* Anterior */}
                            {paginaActual > 1 && (
                                <Pagination.Prev onClick={() => setPaginaActual(paginaActual - 1)} />
                            )}

                            {/* Números de página con lógica de ventana */}
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                                .filter((num) => {
                                    if (totalPaginas <= 5) return true;
                                    if (paginaActual <= 3) return num <= 5;
                                    if (paginaActual >= totalPaginas - 2) return num >= totalPaginas - 4;
                                    return Math.abs(paginaActual - num) <= 2;
                                })
                                .map((num) => (
                                    <Pagination.Item
                                        key={num}
                                        active={paginaActual === num}
                                        onClick={() => setPaginaActual(num)}
                                    >
                                        {num}
                                    </Pagination.Item>
                                ))}

                            {/* Siguiente */}
                            {paginaActual < totalPaginas && (
                                <Pagination.Next onClick={() => setPaginaActual(paginaActual + 1)} />
                            )}
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
