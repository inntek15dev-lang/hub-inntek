import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCatalogItems } from '../services/api';
import logo from '../assets/logo.gif';

const Home = () => {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        getCatalogItems()
            .then(data => setFeatured(data.slice(0, 4)))
            .catch(() => setFeatured([]));
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section data-hero>
                <figure data-logo>
                    <img src={logo} alt="Hub Inntek Logo" />
                </figure>
                <h2>Hub Inntek Technologies</h2>
                <p>
                    Somos líderes en el desarrollo de soluciones tecnológicas innovadoras.
                    Nuestro enfoque central se basa en la construcción de ecosistemas digitales robustos
                    bajo los más altos estándares de calidad (IEEE 12207:2017). Proveemos plataformas
                    escalables, seguras y de alto rendimiento orientadas a optimizar los procesos de negocio.
                </p>
                <Link to="/catalog">
                    <button type="submit">Explorar Catálogo de Productos</button>
                </Link>
            </section>

            {/* Featured Carousel */}
            <h3>Productos Destacados</h3>
            <section data-carousel>
                {featured.length > 0 ? featured.map(el => (
                    <article key={el.id}>
                        <header>
                            <h3>{el.titulo}</h3>
                        </header>
                        <mark>{el.tipo_producto || 'N/A'}</mark>
                        <footer>
                            <Link to={`/catalog#item-${el.id}`}>
                                <button>Ver en Catálogo</button>
                            </Link>
                        </footer>
                    </article>
                )) : (
                    <p>Cargando destacados...</p>
                )}
            </section>
        </main>
    );
};

export default Home;
