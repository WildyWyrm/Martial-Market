import { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Form,
    Button,
    Card,
    Row,
    Col,
    Image,
    Pagination,
    Alert,
} from "react-bootstrap";
import "../styles/Admin.css";

function FormularioProducto({ onProductoAgregado }) {
    const [producto, setProducto] = useState({
        name: "",
        descriptin: "",
        price: "",
        image: "",
    });

    const handleChange = (e) => {
        setProducto({ ...producto, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "https://682a8de1ab2b5004cb370219.mockapi.io/Productos",
                producto
            );
            alert("Producto agregado exitosamente");
            setProducto({ name: "", descriptin: "", price: "", image: "" });
            onProductoAgregado();
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Ocurrió un error al agregar el producto");
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
                        <Form.Control
                            type="number"
                            name="price"
                            placeholder="Precio"
                            value={producto.price}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            name="image"
                            placeholder="URL de la imagen"
                            value={producto.image}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col md={12}>
                        <Button type="submit" className="w-100" variant="success">
                            Agregar Producto
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}

export default function Admin() {
    const [productos, setProductos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 5;

    const [productoEditandoId, setProductoEditandoId] = useState(null);
    const [productoEditandoDatos, setProductoEditandoDatos] = useState({
        name: "",
        descriptin: "",
        price: "",
        image: "",
    });

    const [verMasDescripcion, setVerMasDescripcion] = useState({});

    const toggleVerMas = (id) => {
        setVerMasDescripcion((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const fetchProductos = async () => {
        try {
            const res = await axios.get(
                "https://682a8de1ab2b5004cb370219.mockapi.io/Productos"
            );
            setProductos(res.data);
        } catch (error) {
            console.error("Error al cargar productos", error);
            alert("No se pudieron cargar los productos");
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const borrarProducto = async (id) => {
        try {
            await axios.delete(
                `https://682a8de1ab2b5004cb370219.mockapi.io/Productos/${id}`
            );
            setProductos(productos.filter((producto) => producto.id !== id));
            alert("Producto borrado correctamente");
        } catch (error) {
            console.error("Error al borrar producto", error);
            alert("No se pudo borrar el producto");
        }
    };

    const iniciarEdicion = (producto) => {
        setProductoEditandoId(producto.id);
        setProductoEditandoDatos({ ...producto });
    };

    const cancelarEdicion = () => {
        setProductoEditandoId(null);
        setProductoEditandoDatos({ name: "", descriptin: "", price: "", image: "" });
    };

    const handleEditChange = (e) => {
        setProductoEditandoDatos({
            ...productoEditandoDatos,
            [e.target.name]: e.target.value,
        });
    };

    const guardarEdicion = async () => {
        try {
            await axios.put(
                `https://682a8de1ab2b5004cb370219.mockapi.io/Productos/${productoEditandoId}`,
                productoEditandoDatos
            );
            alert("Producto actualizado correctamente");
            setProductoEditandoId(null);
            fetchProductos();
        } catch (error) {
            console.error("Error al actualizar producto", error);
            alert("No se pudo actualizar el producto");
        }
    };

    const totalPaginas = Math.ceil(productos.length / productosPorPagina);
    const productosMostrados = productos.slice(
        (paginaActual - 1) * productosPorPagina,
        paginaActual * productosPorPagina
    );

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Panel de Administración</h1>

            <FormularioProducto onProductoAgregado={fetchProductos} />

            <h2 className="mt-5">Productos existentes</h2>

            {productos.length === 0 ? (
                <Alert variant="info">No hay productos cargados.</Alert>
            ) : (
                <>
                    {productosMostrados.map((producto) => (
                        <Card key={producto.id} className="mb-3">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={2} className="text-center mb-3 mb-md-0">
                                        <Image
                                            src={producto.image}
                                            alt={producto.name}
                                            rounded
                                            fluid
                                            style={{ maxHeight: "80px", objectFit: "cover" }}
                                        />
                                    </Col>

                                    <Col md={7}>
                                        {productoEditandoId === producto.id ? (
                                            <>
                                                <Form.Control
                                                    className="mb-2"
                                                    type="text"
                                                    name="name"
                                                    value={productoEditandoDatos.name}
                                                    onChange={handleEditChange}
                                                    required
                                                />
                                                <Form.Control
                                                    className="mb-2"
                                                    type="text"
                                                    name="descriptin"
                                                    value={productoEditandoDatos.descriptin}
                                                    onChange={handleEditChange}
                                                    required
                                                />
                                                <Form.Control
                                                    className="mb-2"
                                                    type="number"
                                                    name="price"
                                                    value={productoEditandoDatos.price}
                                                    onChange={handleEditChange}
                                                    required
                                                />
                                                <Form.Control
                                                    className="mb-2"
                                                    type="text"
                                                    name="image"
                                                    value={productoEditandoDatos.image}
                                                    onChange={handleEditChange}
                                                    required
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <h5>{producto.name}</h5>
                                                <p className="mb-1 text-muted">
                                                    {verMasDescripcion[producto.id]
                                                        ? producto.descriptin
                                                        : producto.descriptin?.length > 150
                                                            ? producto.descriptin.slice(0, 150) + "..."
                                                            : producto.descriptin}
                                                    {producto.descriptin?.length > 150 && (
                                                        <Button
                                                            variant="link"
                                                            className="p-0 ps-1"
                                                            onClick={() => toggleVerMas(producto.id)}
                                                        >
                                                            {verMasDescripcion[producto.id] ? "Ver menos" : "Ver más"}
                                                        </Button>
                                                    )}
                                                </p>

                                                <strong>
                                                    ${Number(String(producto.price).replace(/\./g, '').replace(',', '.')).toLocaleString("es-AR", {
                                                        style: "decimal",
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    })}

                                                </strong>
                                            </>
                                        )}
                                    </Col>

                                    <Col md={3} className="text-md-end">
                                        {productoEditandoId === producto.id ? (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={guardarEdicion}
                                                    className="me-2"
                                                >
                                                    Guardar
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={cancelarEdicion}
                                                >
                                                    Cancelar
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => iniciarEdicion(producto)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => borrarProducto(producto.id)}
                                                >
                                                    Borrar
                                                </Button>
                                            </>
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}

                    {/* Paginación */}
                    <Pagination className="justify-content-center mt-4">
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
            )}
        </Container>
    );
}
