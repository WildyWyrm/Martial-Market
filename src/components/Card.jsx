import { Card as BCard, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Productos.css';

function Card({ producto }) {
    return (
        <BCard className="producto-card h-100 d-flex flex-column text-center">
            <BCard.Body className="d-flex flex-column">
                <BCard.Title className="text-dark fs-5">{producto.name}</BCard.Title>
                <Link to={`/productos/${producto.id}`} className="mx-auto my-3">
                    <BCard.Img
                        variant="top"
                        src={producto.image}
                        className="producto-image"
                        style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover' }}
                    />
                </Link>
                <BCard.Text className="text-dark fw-bold">${producto.price}</BCard.Text>

                <div className="mt-auto">
                    <Link to={`/productos/${producto.id}`}>
                        <Button
                            style={{
                                backgroundColor: '#2a82da',
                                borderColor: '#2a82da',
                                boxShadow: '0 4px 8px rgba(42, 130, 218, 0.4)',
                            }}
                            size="sm"
                        >
                            Ver detalles del producto
                        </Button>


                    </Link>
                </div>
            </BCard.Body>
        </BCard>
    );
}

export default Card;
