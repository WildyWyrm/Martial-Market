import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState(null); // mensaje para feedback accesible
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        try {
            await signup(email, password);
            setMensaje("Usuario registrado correctamente");
            alert("Usuario registrado correctamente");
            navigate("/login");
        } catch (error) {
            setMensaje("Error al registrarse: " + error.message);
            alert("Error al registrarse: " + error.message);
        }
    };

    return (
        <main className="signup-container" aria-label="Formulario de registro">
            <form onSubmit={handleSubmit} className="signup-form" noValidate>
                <h2 className="signup-title text-center mt-4">Registrarse</h2>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                        aria-describedby="emailHelp"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <button type="submit" className="submit-button">
                    Crear cuenta
                </button>

                {mensaje && (
                    <p role="alert" aria-live="assertive" className="mensaje-feedback">
                        {mensaje}
                    </p>
                )}

                <p className="redirect-login">
                    ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión acá</Link>
                </p>
            </form>
        </main>
    );
}

export default Signup;
