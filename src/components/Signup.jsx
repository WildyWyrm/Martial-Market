import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password);
            alert("Usuario registrado correctamente");
            navigate("/login");
        } catch (error) {
            alert("Error al registrarse: " + error.message);
        }
    };

    return (
        <div className="signup-container">
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
            <h2 className="signup-title text-center mt-4">Registrarse</h2>


            <div style={{ marginBottom: 12 }}>
                <label>Email:</label>
                <br />
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
                <label>Contraseña:</label>
                <br />
                <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    style={{ width: "100%", padding: 8 }}
                />
            </div>

            <button type="submit" style={{ width: "100%", padding: 10 }}>
                Crear cuenta
            </button>
        </form>
        </div>
    );
}

export default Signup;
