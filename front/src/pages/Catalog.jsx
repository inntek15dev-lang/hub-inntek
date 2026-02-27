import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCatalogItems, deleteCatalogItem } from '../services/api';
import CatalogCard from '../components/CatalogCard';

const Catalog = () => {
    const { isAuthenticated, canWrite } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await getCatalogItems();
            setItems(data);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar los elementos del catálogo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;
        try {
            await deleteCatalogItem(id);
            fetchItems();
        } catch (err) {
            alert('Error al eliminar: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <main><p>Cargando catálogo...</p></main>;
    if (error) return <main><p>{error}</p></main>;

    const showAdmin = isAuthenticated && canWrite('Catalogo');

    return (
        <main>
            <header data-page-header>
                <h2>Catálogo de Productos y Servicios</h2>
                {showAdmin && (
                    <Link to="/admin/catalog/new">
                        <button type="submit">+ Nuevo Elemento</button>
                    </Link>
                )}
            </header>
            <section>
                {items.map(el => (
                    <div key={el.id} id={`item-${el.id}`}>
                        <CatalogCard
                            element={el}
                            onDelete={() => handleDelete(el.id)}
                            showAdmin={showAdmin}
                        />
                    </div>
                ))}
                {items.length === 0 && <p>No hay elementos en el catálogo.</p>}
            </section>
        </main>
    );
};

export default Catalog;
