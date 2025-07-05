import React from 'react';
import { Container, Form, Button, Col } from 'react-bootstrap';
import Footer from '../components/Footer'; 
import { Helmet } from 'react-helmet-async';
import '../styles/Contacto.css';

function Contacto() {
    return (
        <div className="contacto-page">
            <Helmet>
                <title>Contacto | Martial Market</title>
                <meta
                    name="description"
                    content="Envíanos un mensaje para consultas, dudas o soporte en Martial Market, tu tienda online de artículos de artes marciales."
                />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="utf-8" />
            </Helmet>

            <Container className="contenedor">
                <section id="contacto" aria-label="Formulario de contacto">
                    <h2 className="text-center mb-4">Envíanos un mensaje</h2>

                    <Form
                        action="https://formspree.io/f/mzzbzqlp"
                        method="POST"
                        className="row g-3"
                    >
                        <Col md={6}>
                            <Form.Group controlId="nombre">
                                <Form.Label>Nombre y Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    placeholder="Tu nombre completo"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group controlId="mensaje">
                                <Form.Label>Mensaje</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="mensaje"
                                    placeholder="Escribe tu mensaje aquí"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} className="text-center mt-3">
                            <Button variant="primary" type="submit" size="lg" className="px-5">
                                Enviar Mensaje
                            </Button>
                        </Col>
                    </Form>
                </section>
            </Container>

            <Container className="my-5">
                <h2 className="text-center mb-4">Ubicación</h2>
                <div
                    className="map-container"
                    aria-label="Mapa de ubicación de Martial Market"
                >
                    <iframe
                        title="Ubicación Martial Market"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.1238954637756!2d-58.772739723476775!3d-34.60102845735749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc96705fb6c5b5%3A0xe56b8bd55d0aaf50!2sManuel%20G%C3%A1lvez%208342%2C%20B1744%20Moreno%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1709428274263!5m2!1ses!2sar"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </Container>

            <Footer />
        </div>
    );
}

export default Contacto;
