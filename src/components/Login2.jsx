import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // <-- importamos Link
import { useAuth } from "../contexts/AuthContext";

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
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
            <h2>Iniciar sesión</h2>

            <div style={{ marginBottom: 12 }}>
                <label>Email:</label><br />
                <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    style={{ width: "100%", padding: 8 }}
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Contraseña:</label><br />
                <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={{ width: "100%", padding: 8 }}
                />
            </div>

            <button type="submit" style={{ width: "100%", padding: 10 }}>
                Iniciar sesión
            </button>

            <hr style={{ margin: "20px 0" }} />

            <button
                type="button"
                onClick={handleGoogleLogin}
                style={{ width: "100%", padding: 10, backgroundColor: "#4285F4", color: "white", border: "none", cursor: "pointer" }}
            >
                Iniciar sesión con Google
            </button>

            {/* Aquí el link para registrarse */}
            <p style={{ marginTop: 20, textAlign: "center" }}>
                ¿No tenés cuenta? <Link to="/signup">Registrate acá</Link>
            </p>
        </form>
    );
}

export default Login2;
