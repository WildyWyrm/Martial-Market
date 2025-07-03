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
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="login-title text-center mt-4">Iniciar sesión</h2>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
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

                <hr style={{ margin: "20px 0" }} />

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
        </div>
    );
}

export default Login2;
