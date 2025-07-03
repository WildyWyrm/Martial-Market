import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Perfil.css";

function Perfil() {
    const { user, updateProfile } = useAuth();
    const [nombre, setNombre] = useState(user?.displayName || "");
    const [mensaje, setMensaje] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ displayName: nombre });
            setMensaje("Nombre actualizado correctamente");
        } catch (error) {
            setMensaje("Error al actualizar nombre: " + error.message);
        }
    };

    return (
        <div className="perfil-container">
            <form onSubmit={handleUpdate} className="perfil-form">
                <h2 className="perfil-title text-center mt-4">Perfil de Usuario</h2>
                <p className="perfil-email"><strong>Email:</strong> {user.email}</p>

                <div className="form-group">
                    <label>Nombre visible:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Actualizar nombre</button>

                {mensaje && <p className="perfil-mensaje">{mensaje}</p>}
            </form>
        </div>
    );
}

export default Perfil;
