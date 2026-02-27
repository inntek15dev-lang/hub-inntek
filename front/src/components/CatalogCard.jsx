import React from 'react';
import { Link } from 'react-router-dom';

const CatalogCard = ({ element, onDelete, showAdmin }) => {
    return (
        <article>
            <figure>
                <img src={element.imagen_url || '/logo.gif'} alt={element.titulo} />
            </figure>
            <header>
                <h3>{element.titulo}</h3>
            </header>
            <mark>{element.tipo_producto || 'N/A'}</mark>
            {element.categoria_nombre && <small>{element.categoria_nombre}</small>}
            <p>{element.detalle}</p>
            <footer>
                {element.url_sitio && element.url_sitio !== '#' && (
                    <a href={element.url_sitio} target="_blank" rel="noreferrer">Ir al Sitio</a>
                )}
                {element.url_documentacion && element.url_documentacion !== '#' && (
                    <a href={element.url_documentacion} target="_blank" rel="noreferrer">Documentación</a>
                )}
                {showAdmin && (
                    <>
                        <Link to={`/admin/catalog/${element.id}/edit`}>
                            <button>Editar</button>
                        </Link>
                        <button onClick={onDelete}>Eliminar</button>
                    </>
                )}
            </footer>
        </article>
    );
};

export default CatalogCard;
