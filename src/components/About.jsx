import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import "../styles/About.css";

function About() {
  return (
    <section className="about-section bg-dark text-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2>Sobre Nosotros</h2>
            <p>
              Bienvenido a nuestra tienda online. Nos especializamos en ofrecer
              productos de alta calidad a precios accesibles. Nuestro objetivo es
              brindarte una experiencia de compra simple, rápida y segura.
            </p>
            <p>
              Ya sea que estés buscando tecnología, ropa, accesorios o más, en
              nuestro e-commerce vas a encontrar lo que necesitás.
            </p>
            <Image
              src="https://martialmarkets.netlify.app/imagenes/Martial%20Market.png"
              alt="Martial Market Logo"
              fluid
              rounded
              className="about-image mt-4"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default About;
