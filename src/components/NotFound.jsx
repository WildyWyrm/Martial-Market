import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div style={{ textAlign: "center", padding: "3rem" }}>
            <h1>404 - Página no encontrada</h1>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <p>
                Podés volver al{" "}
                <Link to="/" style={{ color: "#007bff", textDecoration: "underline" }}>
                    inicio
                </Link>{" "}
                o explorar otras secciones.
            </p>
            <img
                src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
                alt="404 error"
                style={{ width: "200px", marginTop: "2rem" }}
            />
        </div>
    );
}

export default NotFound;
