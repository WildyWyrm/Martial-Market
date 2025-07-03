import '../styles/Main.css';
import { Link } from 'react-router-dom';

function Main() {
    return (
        <main>
            <h2 className="main-heading">Tienda de Artículos de Artes Marciales</h2>
            <div className="banner-promocion">
                <h2 className="banner-title">¡POTENCIA TU ENTRENAMIENTO HOY MISMO!</h2>
                <p className="banner-text">
                    Descubrí nuestras ofertas exclusivas en artículos de artes marciales.
                </p>
                <Link to="/productos" className="btn-banner">
                    Ver productos
                </Link>
            </div>
        </main>
    );
}

export default Main;
