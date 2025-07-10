import { useState, useEffect } from "react";
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
    InputGroup,
} from "react-bootstrap";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import "../styles/admin.css";

// Función para formatear número con puntos de miles (mostrar)
const formatearMiles = (valor) => {
    if (valor === null || valor === undefined) return "";
    const num = Number(valor.toString().replace(/\./g, "").replace(",", "."));
    return num.toLocaleString("es-AR", {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};


// Función para parsear string precio a número float (guardar)
const parsearPrecio = (str) => {
    if (!str) return null;
    const limpio = str.toString().replace(/\./g, "").replace(",", ".");
    const num = parseFloat(limpio);
    return isNaN(num) ? null : num;
};

function FormularioProducto({ onProductoAgregado }) {
    const [producto, setProducto] = useState({
        name: "",
        descriptin: "",
        price: "", // precio unitario (para talle único)
        image: "",
    });
    const [talles, setTalles] = useState([]); // lista de talles para inputs

    // Manejo cambio campos simples
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si es price, formatear para mostrar puntos (opcional)
        if (name === "price") {
            // Permitimos solo números y puntos en el input
            const valorFormateado = value.replace(/[^0-9.]/g, "");
            setProducto({ ...producto, [name]: valorFormateado });
        } else {
            setProducto({ ...producto, [name]: value });
        }
    };

    // Agregar nuevo talle vacío para editar
    const agregarTalle = () => {
        setTalles([...talles, { talle: "", precio: "" }]);
    };

    // Quitar talle por índice
    const quitarTalle = (index) => {
        setTalles(talles.filter((_, i) => i !== index));
    };

    // Cambiar talle o precio dentro del arreglo de talles
    const handleTalleChange = (index, field, value) => {
        const nuevosTalles = [...talles];

        // Para precio, permitir sólo números y puntos
        if (field === "precio") {
            const valorFormateado = value.replace(/[^0-9.]/g, "");
            nuevosTalles[index][field] = valorFormateado;
        } else {
            nuevosTalles[index][field] = value;
        }

        setTalles(nuevosTalles);
    };

    // Al enviar, procesamos talles en objeto si existen
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Filtrar talles válidos
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

        const precioUnicoLimpio =
            producto.price.trim() !== "" ? parsearPrecio(producto.price) : null;

        try {
            await addDoc(collection(db, "productos"), {
                name: producto.name,
                descriptin: producto.descriptin,
                price: objetoPrices ? null : precioUnicoLimpio,
                prices: objetoPrices,
                image: producto.image,
            });
            alert("Producto agregado exitosamente");
            setProducto({ name: "", descriptin: "", price: "", image: "" });
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

                    {/* Si hay talles, ocultamos el precio único */}
                    {talles.length === 0 && (
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                name="price"
                                placeholder="Precio (para talle único)"
                                value={producto.price}
                                onChange={handleChange}
                                required={talles.length === 0}
                            />
                        </Col>
                    )}

                    <Col md={6}>
                        <Form.Control
                            type="url"
                            name="image"
                            placeholder="URL de la imagen"
                            value={producto.image}
                            onChange={handleChange}
                            required
                        />
                    </Col>

                    <Col md={12} className="mt-3">
                        <h5>Precios por talle (opcional)</h5>
                        {talles.map((t, index) => (
                            <Row key={index} className="mb-2 align-items-center">
                                <Col md={5}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Talle (ej: S, M, L)"
                                        value={t.talle}
                                        onChange={(e) => handleTalleChange(index, "talle", e.target.value)}
                                        required
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
                                            required
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={2}>
                                    <Button variant="danger" onClick={() => quitarTalle(index)} title="Quitar talle">
                                        X
                                    </Button>
                                </Col>
                            </Row>
                        ))}

                        <Button variant="secondary" onClick={agregarTalle}>
                            Agregar talle
                        </Button>
                    </Col>

                    <Col md={12} className="mt-4">
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
        prices: {}, // objeto talles:precio
        image: "",
    });
    const [tallesEditando, setTallesEditando] = useState([]);

    const [verMasDescripcion, setVerMasDescripcion] = useState({});

    const toggleVerMas = (id) => {
        setVerMasDescripcion((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Carga productos desde Firestore
    const fetchProductos = async () => {
        try {
            const productosCol = collection(db, "productos");
            const snapshot = await getDocs(productosCol);
            const listaProductos = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProductos(listaProductos);
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
            await deleteDoc(doc(db, "productos", id));
            setProductos(productos.filter((p) => p.id !== id));
            alert("Producto borrado correctamente");
        } catch (error) {
            console.error("Error al borrar producto", error);
            alert("No se pudo borrar el producto");
        }
    };

    const iniciarEdicion = (producto) => {
        setProductoEditandoId(producto.id);
        setProductoEditandoDatos({
            name: producto.name || "",
            descriptin: producto.descriptin || "",
            price: producto.price ? formatearMiles(producto.price) : "",
            prices: producto.prices || {},
            image: producto.image || "",
        });

        // Convertir objeto prices a array para edición con formato puntos
        if (producto.prices) {
            const tallesArray = Object.entries(producto.prices).map(([talle, precio]) => ({
                talle,
                precio: formatearMiles(precio),
            }));
            setTallesEditando(tallesArray);
        } else {
            setTallesEditando([]);
        }
    };

    const cancelarEdicion = () => {
        setProductoEditandoId(null);
        setProductoEditandoDatos({ name: "", descriptin: "", price: "", prices: {}, image: "" });
        setTallesEditando([]);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === "price") {
            const valorFormateado = value.replace(/[^0-9.]/g, "");
            setProductoEditandoDatos({
                ...productoEditandoDatos,
                [name]: valorFormateado,
            });
        } else {
            setProductoEditandoDatos({
                ...productoEditandoDatos,
                [name]: value,
            });
        }
    };

    const agregarTalleEdit = () => {
        setTallesEditando([...tallesEditando, { talle: "", precio: "" }]);
    };

    const quitarTalleEdit = (index) => {
        setTallesEditando(tallesEditando.filter((_, i) => i !== index));
    };

    const handleTalleEditChange = (index, field, value) => {
        const nuevosTalles = [...tallesEditando];
        if (field === "precio") {
            const valorFormateado = value.replace(/[^0-9.]/g, "");
            nuevosTalles[index][field] = valorFormateado;
        } else {
            nuevosTalles[index][field] = value;
        }
        setTallesEditando(nuevosTalles);
    };

    const guardarEdicion = async () => {
        try {
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

            const precioLimpio = productoEditandoDatos.price
                ? parsearPrecio(productoEditandoDatos.price)
                : null;

            const docRef = doc(db, "productos", productoEditandoId);
            await updateDoc(docRef, {
                name: productoEditandoDatos.name,
                descriptin: productoEditandoDatos.descriptin,
                price: objetoPrices ? null : precioLimpio,
                prices: objetoPrices,
                image: productoEditandoDatos.image,
            });
            alert("Producto actualizado correctamente");
            setProductoEditandoId(null);
            setTallesEditando([]);
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

                                                {/* Mostrar input precio único solo si no hay talles */}
                                                {tallesEditando.length === 0 && (
                                                    <Form.Control
                                                        className="mb-2"
                                                        type="text"
                                                        name="price"
                                                        placeholder="Precio (para talle único)"
                                                        value={productoEditandoDatos.price}
                                                        onChange={handleEditChange}
                                                        required={tallesEditando.length === 0}
                                                    />
                                                )}

                                                <Form.Control
                                                    className="mb-2"
                                                    type="text"
                                                    name="image"
                                                    value={productoEditandoDatos.image}
                                                    onChange={handleEditChange}
                                                    required
                                                />

                                                {/* Edición de talles */}
                                                <div className="mb-3">
                                                    <h6>Precios por talle (opcional)</h6>
                                                    {tallesEditando.map((t, index) => (
                                                        <Row key={index} className="mb-2 align-items-center">
                                                            <Col md={5}>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Talle (ej: S, M, L)"
                                                                    value={t.talle}
                                                                    onChange={(e) =>
                                                                        handleTalleEditChange(index, "talle", e.target.value)
                                                                    }
                                                                    required
                                                                />
                                                            </Col>
                                                            <Col md={5}>
                                                                <InputGroup>
                                                                    <InputGroup.Text>$</InputGroup.Text>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Precio"
                                                                        value={t.precio}
                                                                        onChange={(e) =>
                                                                            handleTalleEditChange(index, "precio", e.target.value)
                                                                        }
                                                                        required
                                                                    />
                                                                </InputGroup>
                                                            </Col>
                                                            <Col md={2}>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => quitarTalleEdit(index)}
                                                                    title="Quitar talle"
                                                                >
                                                                    X
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    ))}

                                                    <Button variant="secondary" onClick={agregarTalleEdit}>
                                                        Agregar talle
                                                    </Button>
                                                </div>
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

                                                {/* Mostrar precio único o listado de talles */}
                                                {producto.prices && Object.keys(producto.prices).length > 0 ? (
                                                    <ul>
                                                        {Object.entries(producto.prices).map(([talle, precio]) => (
                                                            <li key={talle}>
                                                                <strong>{talle}:</strong> <strong>${formatearMiles(precio)}</strong>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <strong>${formatearMiles(producto.price)}</strong>
                                                )}
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
                                                <Button variant="secondary" size="sm" onClick={cancelarEdicion}>
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
