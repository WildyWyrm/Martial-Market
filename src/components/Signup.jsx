import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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
            <form onSubmit={handleSubmit} className="signup-form">
                <h2 className="signup-title text-center mt-4">Registrarse</h2>

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
                        autoComplete="new-password"
                    />
                </div>

                <button type="submit" className="submit-button">
                    Crear cuenta
                </button>

                <p className="redirect-login">
                    ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión acá</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;
