import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

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
        <div style={{ maxWidth: 400, margin: "auto" }}>
            <h2>Perfil de Usuario</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Nombre visible:</label><br />
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8 }}
                    />
                </div>
                <button type="submit" style={{ marginTop: 10 }}>Actualizar nombre</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default Perfil;
