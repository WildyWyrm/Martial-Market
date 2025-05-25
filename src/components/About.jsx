import React from "react";
import "../styles/About.css";  

function About() {
  return (
    <section className="about-section">
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
      <img 
        src="https://martialmarkets.netlify.app/imagenes/Martial%20Market.png" 
        alt="Martial Market Logo" 
        className="about-image"
      />
    </section>
  );
}

export default About;
