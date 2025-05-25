import React from "react";
import "../styles/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <p>Email: martialmarkets@gmail.com</p>
            <p>Teléfono: +54 911 2165 5127</p>
            <p>Dirección: Galvez 8342, Moreno - Zona oeste, Argentina</p>

            <div className="social-icons">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="icon">
                    <i className="fab fa-facebook fa-2x"></i>
                </a>
                <a href="https://www.instagram.com/martial.market_moreno/" target="_blank" rel="noopener noreferrer" className="icon">
                    <i className="fab fa-instagram fa-2x"></i>
                </a>
                <a href="https://wa.me/5491121655127" target="_blank" rel="noopener noreferrer" className="icon">
                    <i className="fab fa-whatsapp fa-2x"></i>
                </a>
            </div>
        </footer>
    );
}

export default Footer;
