import React from "react";
import "../styles/Footer.css";

function Footer() {
    return (
        <footer className="footer" role="contentinfo">
            <address>
                <ul>
                    <li>Email: <a href="mailto:martialmarkets@gmail.com">martialmarkets@gmail.com</a></li>
                    <li>Teléfono: <a href="tel:+5491121655127">+54 911 2165 5127</a></li>
                    <li>Dirección: Galvez 8342, Moreno - Zona oeste, Argentina</li>
                </ul>
            </address>

            <div className="social-icons" aria-label="Redes sociales">
                <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon"
                    aria-label="Facebook"
                >
                    <i className="fab fa-facebook fa-2x"></i>
                </a>
                <a
                    href="https://www.instagram.com/martial.market_moreno/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon"
                    aria-label="Instagram"
                >
                    <i className="fab fa-instagram fa-2x"></i>
                </a>
                <a
                    href="https://wa.me/5491121655127"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon"
                    aria-label="WhatsApp"
                >
                    <i className="fab fa-whatsapp fa-2x"></i>
                </a>
            </div>
        </footer>
    );
}

export default Footer;
