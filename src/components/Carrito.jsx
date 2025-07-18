import "../styles/Carrito.css";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import { CarritoContext } from "../contexts/CarritoContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Helmet } from "react-helmet-async";

export default function Carrito() {
    const { user } = useAuth();
    const { productosCarrito, vaciarCarrito, borrarProductoCarrito } = useContext(CarritoContext);

    const [verMas, setVerMas] = useState({});

    const toggleDescripcion = (id) => {
        setVerMas((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const total = productosCarrito.reduce((subTotal, producto) => {
        const precioNumerico = Number(
            String(producto.price).replace(/\./g, "").replace(",", ".")
        );
        return subTotal + precioNumerico * producto.cantidad;
    }, 0);

    if (!user) return <Navigate to="/login" replace />;

    return (
        <>
            <Helmet>
                <title>Tu Carrito de Compras | Martial Market</title>
                <meta
                    name="description"
                    content="Revisa y gestiona los productos que has agregado a tu carrito en Martial Market. Compra fácil, rápida y segura."
                />
            </Helmet>

            <section aria-label="Carrito de compras">
                <Container className="my-5">
                    <h2 className="carrito-titulo text-center mb-4">Tu Carrito</h2>

                    {productosCarrito.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            Carrito vacío
                        </Alert>
                    ) : (
                        <div className="carrito-contenedor">
                            <div className="text-end mb-4">
                                <Button variant="outline-danger" onClick={vaciarCarrito}>
                                    Vaciar carrito
                                </Button>
                            </div>

                            <Row className="fw-bold text-uppercase text-center mb-2 d-none d-md-flex">
                                <Col md={1}>Imagen</Col>
                                <Col md={5}>Producto</Col>
                                <Col md={1}>Cantidad</Col>
                                <Col md={2}>Precio Unitario</Col>
                                <Col md={2}>Subtotal</Col>
                                <Col md={1}></Col>
                            </Row>

                            <Row className="g-4">
                                {productosCarrito.map((producto) => {
                                    const precioUnit = Number(
                                        String(producto.price).replace(/\./g, "").replace(",", ".")
                                    );
                                    const subtotal = precioUnit * producto.cantidad;
                                    const descripcion = producto.descriptin || "-";
                                    const verTodo = verMas[producto.id];

                                    return (
                                        <Col xs={12} key={producto.id + (producto.talle || "")}>
                                            <Card className="shadow-sm">
                                                <Card.Body>
                                                    <Row className="align-items-center text-md-start">
                                                        <Col xs={12} md={1} className="text-center mb-2 mb-md-0">
                                                            <img
                                                                src={producto.images?.[0] || "/placeholder.jpg"}
                                                                alt={producto.name}
                                                                className="img-fluid rounded-circle"
                                                                style={{ maxWidth: "70px", height: "auto" }}
                                                            />

                                                        </Col>

                                                        <Col xs={12} md={5}>
                                                            <h5 className="mb-1">
                                                                {producto.name}{" "}
                                                                {producto.talle ? (
                                                                    <span className="text-muted small">- Talle {producto.talle}</span>
                                                                ) : null}
                                                            </h5>
                                                            <p
                                                                id={`descripcion-${producto.id}`}
                                                                className={`descripcion ${verTodo ? "ver-mas" : ""}`}
                                                            >
                                                                {descripcion}
                                                            </p>
                                                            {descripcion.length > 70 && (
                                                                <button
                                                                    className="btn-ver-mas"
                                                                    onClick={() => toggleDescripcion(producto.id)}
                                                                    aria-expanded={verTodo ? "true" : "false"}
                                                                    aria-controls={`descripcion-${producto.id}`}
                                                                >
                                                                    {verTodo ? "Ver menos" : "Ver más"}
                                                                </button>
                                                            )}
                                                        </Col>

                                                        <Col xs={6} md={1} className="text-md-center">
                                                            <p className="mb-0">{producto.cantidad}</p>
                                                        </Col>

                                                        <Col xs={6} md={2} className="text-md-center">
                                                            <p className="mb-0">
                                                                ${precioUnit.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
                                                            </p>
                                                        </Col>

                                                        <Col xs={6} md={2} className="text-md-center mt-2 mt-md-0">
                                                            <p className="mb-0 text-success fw-semibold">
                                                                ${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
                                                            </p>
                                                        </Col>

                                                        <Col xs={6} md={1} className="text-center text-md-end mt-2 mt-md-0">
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() => borrarProductoCarrito(producto.id, producto.talle)}

                                                            >
                                                                Quitar
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>

                            <div className="d-flex justify-content-center mt-5">
                                <a
                                    href={`https://wa.me/+541121655127?text=¡Hola!%20Estuve%20viendo%20productos%20en%20Martial%20Market%20y%20quisiera%20finalizar%20mi%20compra.%20¿Podrías%20ayudarme%20con%20los%20pasos%20siguientes?`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: "none" }}
                                >
                                    <div className="carrito-vacio text-center px-4 py-3">
                                        Total a pagar: ${total.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
                                    </div>
                                </a>
                            </div>

                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}
