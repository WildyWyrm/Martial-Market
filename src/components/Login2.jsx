import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Login.css";

function Login2() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            alert("Credenciales incorrectas o error al iniciar sesión");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/");
        } catch (error) {
            alert("Error al iniciar sesión con Google");
        }
    };

    return (
        <section
            aria-label="Formulario de inicio de sesión"
            className="login-container"
        >
            <form onSubmit={handleSubmit} className="login-form">
                <h1 className="login-title text-center mt-4">Iniciar sesión</h1>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" className="submit-button">
                    Iniciar sesión
                </button>

                <hr aria-hidden="true" style={{ margin: "20px 0" }} />

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="google-button"
                >
                    Iniciar sesión con Google
                </button>

                <p className="redirect-signup">
                    ¿No tenés cuenta? <Link to="/signup">Registrate acá</Link>
                </p>
            </form>
        </section>
    );
}

export default Login2;
