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
                    <title>Martial Market | Doboks y artículos de artes marciales en Moreno</title>
                    <meta
                        name="description"
                        content="Tienda en Moreno de artículos de artes marciales: doboks, protecciones, accesorios y más. Zona oeste y envíos a todo el país."
                    />
                    <meta
                        name="keywords"
                        content="doboks, artes marciales, moreno, zona oeste, protecciones, taekwondo, karate, uniformes"
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    {/* Open Graph (Facebook y otras redes) */}
                    <meta property="og:title" content="Martial Market | Tienda de Artes Marciales" />
                    <meta
                        property="og:description"
                        content="Comprá tus productos de artes marciales en Moreno. Doboks, protecciones, accesorios y más. Envíos a todo el país."
                    />
                    <meta property="og:image" content="https://martial-market.netlify.app/imagenes/Martial%20Market.png" />
                    <meta property="og:url" content="https://martial-market.netlify.app" />
                    <meta property="og:type" content="website" />

                    {/* Twitter Card */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Martial Market | Tienda de Artes Marciales" />
                    <meta
                        name="twitter:description"
                        content="Tienda en Moreno con artículos para artes marciales: doboks, accesorios, guantes y más."
                    />
                    <meta name="twitter:image" content="https://martial-market.netlify.app/imagenes/Martial%20Market.png" />

                    {/* Canonical para evitar contenido duplicado */}
                    <link rel="canonical" href="https://martial-market.netlify.app/" />

                    {/* Structured Data JSON-LD */}
                    <script type="application/ld+json">
                        {`
                        {
                          "@context": "https://schema.org",
                          "@type": "LocalBusiness",
                          "name": "Martial Market",
                          "image": "https://martial-market.netlify.app/imagenes/Martial%20Market.png",
                          "description": "Tienda en Moreno con artículos para artes marciales: doboks, accesorios, guantes y más.",
                          "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Manuel Gálvez 8342",
                            "addressLocality": "Moreno",
                            "addressRegion": "Buenos Aires",
                            "postalCode": "1744",
                            "addressCountry": "AR"
                          },
                          "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "-34.63579",
                            "longitude": "-58.79142"
                          },
                          "url": "https://martial-market.netlify.app",
                          "telephone": "+54 11 6433-4499",
                          "priceRange": "$$",
                          "sameAs": [
                            "https://www.facebook.com/martialmarket",
                            "https://www.instagram.com/martialmarket"
                          ]
                        }
                        `}
                    </script>
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
