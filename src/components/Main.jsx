import '../styles/Main.css';
import { Link } from 'react-router-dom';

function Main() {
    return (
        <main className="mainbg">
            <section className="main-section" aria-label="Presentación de la tienda de artes marciales">
                <h1 className="main-heading">Tienda de Artículos de Artes Marciales</h1>

                <div className="banner-promocion">
                    <h2 className="banner-title">¡POTENCIÁ TU ENTRENAMIENTO HOY MISMO!</h2>
                    <p className="banner-text">
                        Descubrí nuestras ofertas exclusivas en uniformes, protecciones y accesorios para artes marciales.
                    </p>
                    <Link
                        to="/productos"
                        className="btn-banner"
                        aria-label="Ir a la página de productos"
                    >
                        Ver productos disponibles
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default Main;
