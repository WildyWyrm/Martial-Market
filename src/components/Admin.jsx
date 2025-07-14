import { useState, useEffect } from "react";
import {
    Container, Form, Button, Card, Row, Col, Image, Pagination,
    Alert, InputGroup
} from "react-bootstrap";
import {
    collection, getDocs, addDoc, deleteDoc, doc, updateDoc
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import "../styles/Admin.css";

// Formateo de precios
const formatearMiles = (valor) => {
    if (valor === null || valor === undefined) return "";
    const num = Number(valor.toString().replace(/\./g, "").replace(",", "."));
    return num.toLocaleString("es-AR", {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

const parsearPrecio = (str) => {
    if (!str) return null;
    const limpio = str.toString().replace(/\./g, "").replace(",", ".");
    const num = parseFloat(limpio);
    return isNaN(num) ? null : num;
};

// Componente para formulario
function FormularioProducto({ onProductoAgregado }) {
    const [producto, setProducto] = useState({
        name: "",
        descriptin: "",
        price: "",
        images: "",
    });
    const [talles, setTalles] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "price") {
            const valorFormateado = value.replace(/[^0-9.]/g, "");
            setProducto({ ...producto, [name]: valorFormateado });
        } else {
            setProducto({ ...producto, [name]: value });
        }
    };

    const agregarTalle = () => setTalles([...talles, { talle: "", precio: "" }]);
    const quitarTalle = (index) => setTalles(talles.filter((_, i) => i !== index));
    const handleTalleChange = (index, field, value) => {
        const nuevosTalles = [...talles];
        nuevosTalles[index][field] = field === "precio"
            ? value.replace(/[^0-9.]/g, "")
            : value;
        setTalles(nuevosTalles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tallesValidos = talles.filter(
            (t) => t.talle.trim() !== "" && t.precio.trim() !== "" && parsearPrecio(t.precio) !== null
        );

        let objetoPrices = null;
        if (tallesValidos.length > 0) {
            objetoPrices = tallesValidos.reduce((acc, curr) => {
                acc[curr.talle.trim()] = parsearPrecio(curr.precio);
                return acc;
            }, {});
        }

        const precioUnicoLimpio = producto.price.trim() !== ""
            ? parsearPrecio(producto.price)
            : null;

        const imagenesArray = producto.images
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url !== "");

        try {
            await addDoc(collection(db, "productos"), {
                name: producto.name,
                descriptin: producto.descriptin,
                price: objetoPrices ? null : precioUnicoLimpio,
                prices: objetoPrices,
                images: imagenesArray,
            });
            alert("Producto agregado exitosamente");
            setProducto({ name: "", descriptin: "", price: "", images: "" });
            setTalles([]);
            if (onProductoAgregado) onProductoAgregado();
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
                                    <Button variant="danger" size="sm" onClick={() => quitarTalle(index)} style={{ minWidth: "30px" }}>
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
                        <Button type="submit" className="w-100" variant="success">
                            Agregar Producto
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}

// Componente principal Admin
export default function Admin() {
    const [productos, setProductos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 5;

    const [editandoId, setEditandoId] = useState(null);
    const [productoEditando, setProductoEditando] = useState(null);
    const [tallesEditando, setTallesEditando] = useState([]);

    // ✅ CORREGIDO: Detectar si tiene 'image' en lugar de 'images'
    const fetchProductos = async () => {
        try {
            const snapshot = await getDocs(collection(db, "productos"));
            const lista = snapshot.docs.map((doc) => {
                const data = doc.data();

                if (data.image && !data.images) {
                    data.images = data.image
                        .split(",")
                        .map((url) => url.trim())
                        .filter((url) => url !== "");
                }

                return { id: doc.id, ...data };
            });
            setProductos(lista);
        } catch (error) {
            alert("Error al cargar productos");
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const borrarProducto = async (id) => {
        try {
            await deleteDoc(doc(db, "productos", id));
            setProductos(productos.filter((p) => p.id !== id));
        } catch (error) {
            alert("No se pudo borrar el producto");
        }
    };

    const iniciarEdicion = (producto) => {
        setEditandoId(producto.id);
        setProductoEditando({
            ...producto,
            price: producto.price || "",
            images: producto.images ? producto.images.join(", ") : "",
        });

        if (producto.prices) {
            const tallesArr = Object.entries(producto.prices).map(([t, p]) => ({
                talle: t,
                precio: p.toString(),
            }));
            setTallesEditando(tallesArr);
        } else {
            setTallesEditando([]);
        }
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setProductoEditando(null);
        setTallesEditando([]);
    };

    const handleChangeEdit = (field, value) => {
        setProductoEditando({ ...productoEditando, [field]: value });
    };

    const handleTalleChangeEdit = (index, field, value) => {
        const nuevosTalles = [...tallesEditando];
        nuevosTalles[index][field] = value;
        setTallesEditando(nuevosTalles);
    };

    const agregarTalleEdit = () => setTallesEditando([...tallesEditando, { talle: "", precio: "" }]);
    const quitarTalleEdit = (index) => setTallesEditando(tallesEditando.filter((_, i) => i !== index));

    const guardarEdicion = async () => {
        if (!productoEditando) return;

        const tallesValidos = tallesEditando.filter(
            (t) => t.talle.trim() !== "" && t.precio.trim() !== "" && parsearPrecio(t.precio) !== null
        );

        let objetoPrices = null;
        if (tallesValidos.length > 0) {
            objetoPrices = tallesValidos.reduce((acc, curr) => {
                acc[curr.talle.trim()] = parsearPrecio(curr.precio);
                return acc;
            }, {});
        }

        const precioUnicoLimpio = productoEditando.price.trim() !== ""
            ? parsearPrecio(productoEditando.price)
            : null;

        const imagenesArray = productoEditando.images
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url !== "");

        try {
            await updateDoc(doc(db, "productos", productoEditando.id), {
                name: productoEditando.name.trim(),
                descriptin: productoEditando.descriptin.trim(),
                price: objetoPrices ? null : precioUnicoLimpio,
                prices: objetoPrices,
                images: imagenesArray,
            });
            alert("Producto actualizado exitosamente");
            cancelarEdicion();
            fetchProductos();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            alert("Ocurrió un error al actualizar el producto");
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

            <h2 className="mt-5">Productos</h2>

            {productos.length === 0 ? (
                <Alert variant="info">No hay productos cargados.</Alert>
            ) : (
                <>
                    {productosMostrados.map((producto) => {
                        const esEditando = editandoId === producto.id;

                        return (
                            <Card key={producto.id} className="mb-3 p-3">
                                <Row className="align-items-center">
                                    <Col md={3} className="d-flex flex-wrap gap-2 justify-content-center">
                                        {producto.images?.length > 0 ? (
                                            producto.images.map((img, i) => (
                                                <Image
                                                    key={i}
                                                    src={img}
                                                    alt={`${producto.name} - imagen ${i + 1}`}
                                                    fluid
                                                    rounded
                                                    style={{ maxHeight: "80px", marginRight: 4 }}
                                                />
                                            ))
                                        ) : (
                                            <span>Sin imagen</span>
                                        )}
                                    </Col>

                                    <Col md={6}>
                                        {esEditando ? (
                                            <>
                                                <Form.Control
                                                    size="sm"
                                                    type="text"
                                                    value={productoEditando.name}
                                                    onChange={(e) => handleChangeEdit("name", e.target.value)}
                                                    className="mb-2"
                                                    placeholder="Nombre"
                                                />
                                                <Form.Control
                                                    size="sm"
                                                    type="text"
                                                    value={productoEditando.descriptin}
                                                    onChange={(e) => handleChangeEdit("descriptin", e.target.value)}
                                                    className="mb-2"
                                                    placeholder="Descripción"
                                                />

                                                {tallesEditando.length === 0 && (
                                                    <Form.Control
                                                        size="sm"
                                                        type="text"
                                                        value={productoEditando.price}
                                                        onChange={(e) => handleChangeEdit("price", e.target.value)}
                                                        className="mb-2"
                                                        placeholder="Precio único"
                                                    />
                                                )}

                                                {tallesEditando.length > 0 && (
                                                    <>
                                                        <h6>Precios por talle</h6>
                                                        {tallesEditando.map((t, i) => (
                                                            <Row key={i} className="mb-1 align-items-center">
                                                                <Col xs={5}>
                                                                    <Form.Control
                                                                        size="sm"
                                                                        type="text"
                                                                        placeholder="Talle"
                                                                        value={t.talle}
                                                                        onChange={(e) => handleTalleChangeEdit(i, "talle", e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col xs={5}>
                                                                    <InputGroup>
                                                                        <InputGroup.Text>$</InputGroup.Text>
                                                                        <Form.Control
                                                                            size="sm"
                                                                            type="text"
                                                                            placeholder="Precio"
                                                                            value={t.precio}
                                                                            onChange={(e) => handleTalleChangeEdit(i, "precio", e.target.value)}
                                                                        />
                                                                    </InputGroup>
                                                                </Col>
                                                                <Col xs={2}>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="danger"
                                                                        onClick={() => quitarTalleEdit(i)}
                                                                        style={{ minWidth: "30px" }}
                                                                    >
                                                                        X
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={agregarTalleEdit}
                                                            className="mb-2"
                                                        >
                                                            Agregar talle
                                                        </Button>
                                                    </>
                                                )}

                                                <Form.Control
                                                    size="sm"
                                                    as="textarea"
                                                    rows={2}
                                                    value={productoEditando.images}
                                                    onChange={(e) => handleChangeEdit("images", e.target.value)}
                                                    placeholder="URLs de imágenes, separadas por coma"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <h5>{producto.name}</h5>
                                                <p>{producto.descriptin}</p>
                                                {producto.prices ? (
                                                    <ul className="mb-0">
                                                        {Object.entries(producto.prices).map(([t, p]) => (
                                                            <li key={t}>
                                                                <strong>{t}: ${formatearMiles(p)}</strong>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <strong>${formatearMiles(producto.price)}</strong>
                                                )}
                                            </>
                                        )}
                                    </Col>

                                    <Col
                                        xs="12"
                                        md="auto"
                                        className="d-flex flex-column gap-2 align-items-center align-items-md-end ms-md-auto"
                                    >
                                        {esEditando ? (
                                            <>
                                                <Button size="sm" variant="success" onClick={guardarEdicion} style={{ minWidth: "90px" }}>
                                                    Guardar
                                                </Button>
                                                <Button size="sm" variant="outline-secondary" onClick={cancelarEdicion} style={{ minWidth: "90px" }}>
                                                    Cancelar
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="sm" variant="primary" onClick={() => iniciarEdicion(producto)} style={{ minWidth: "90px" }}>
                                                    Editar
                                                </Button>
                                                <Button size="sm" variant="danger" onClick={() => borrarProducto(producto.id)} style={{ minWidth: "90px" }}>
                                                    Borrar
                                                </Button>
                                            </>
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}

                    <Pagination className="justify-content-center mt-4 pb-4">
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
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
