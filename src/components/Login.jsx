export default function Login({ setLogeadoUser, setLogeadoAdmin, user, admin }) {
    return (
        <section aria-label="Opciones de inicio y cierre de sesión" className="text-center my-4">
            <h2>Gestión de sesión</h2>

            <button
                onClick={setLogeadoUser}
                aria-pressed={user}
                type="button"
                className="btn btn-primary mx-2"
            >
                {user ? "Cerrar sesión de usuario" : "Iniciar sesión de usuario"}
            </button>

            <button
                onClick={setLogeadoAdmin}
                aria-pressed={admin}
                type="button"
                className="btn btn-secondary mx-2"
            >
                {admin ? "Cerrar sesión de administrador" : "Iniciar sesión de administrador"}
            </button>
        </section>
    );
}
