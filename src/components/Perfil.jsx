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
        <main>
            <section
                className="perfil-container"
                aria-label="Sección de perfil del usuario"
            >
                <form
                    onSubmit={handleUpdate}
                    className="perfil-form"
                    aria-labelledby="perfil-title"
                >
                    <h1 id="perfil-title" className="perfil-title text-center mt-4">
                        Perfil de Usuario
                    </h1>

                    <p className="perfil-email">
                        <strong>Email:</strong> {user.email}
                    </p>

                    <div className="form-group">
                        <label htmlFor="nombre-usuario">Nombre visible:</label>
                        <input
                            id="nombre-usuario"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        aria-label="Actualizar nombre visible"
                    >
                        Actualizar nombre
                    </button>

                    {mensaje && <p className="perfil-mensaje">{mensaje}</p>}
                </form>
            </section>
        </main>
    );
}

export default Perfil;
