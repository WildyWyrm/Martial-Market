import React from "react";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";

function Home() {
    return (
        <HelmetProvider>
            <>
                <Helmet>
                    <title>Martial Market - Tienda de Artes Marciales</title>
                    <meta
                        name="description"
                        content="Compra productos de artes marciales de alta calidad a precios accesibles."
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    {/* Puedes agregar más meta tags aquí */}
                </Helmet>

                <header>
                    <Header />
                </header>

                <main>
                    <Main />
                </main>

                <footer>
                    <Footer />
                </footer>
            </>
        </HelmetProvider>
    );
}

export default Home;
