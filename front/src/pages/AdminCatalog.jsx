import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCatalogItemById, createCatalogItem, updateCatalogItem, getCategories } from '../services/api';

const AdminCatalog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        titulo: '',
        detalle: '',
        tipo_producto: '',
        url_sitio: '',
        url_documentacion: '',
        imagen_url: '',
        categoria_id: '',
    });

    useEffect(() => {
        getCategories().then(setCategories).catch(() => { });

        if (isEditing) {
            setLoading(true);
            getCatalogItemById(id)
                .then(data => {
                    setForm({
                        titulo: data.titulo || '',
                        detalle: data.detalle || '',
                        tipo_producto: data.tipo_producto || '',
                        url_sitio: data.url_sitio || '',
                        url_documentacion: data.url_documentacion || '',
                        imagen_url: data.imagen_url || '',
                        categoria_id: data.categoria_id || '',
                    });
                })
                .catch(() => alert('No se pudo cargar el elemento.'))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                categoria_id: form.categoria_id ? parseInt(form.categoria_id) : null,
            };
            if (isEditing) {
                await updateCatalogItem(id, payload);
            } else {
                await createCatalogItem(payload);
            }
            navigate('/catalog');
        } catch (err) {
            alert('Error al guardar: ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return <main><p>Cargando...</p></main>;

    return (
        <main>
            <h2>{isEditing ? 'Editar Elemento' : 'Nuevo Elemento de Catálogo'}</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>Título *</label>
                    <input name="titulo" value={form.titulo} onChange={handleChange} required />

                    <label>Detalle</label>
                    <textarea name="detalle" value={form.detalle} onChange={handleChange} rows={4} />

                    <label>Tipo de Producto</label>
                    <select name="tipo_producto" value={form.tipo_producto} onChange={handleChange}>
                        <option value="">Seleccionar...</option>
                        <option value="MVP">MVP</option>
                        <option value="Demo">Demo</option>
                        <option value="UAT">UAT</option>
                        <option value="Producción">Producción</option>
                    </select>

                    <label>Categoría</label>
                    <select name="categoria_id" value={form.categoria_id} onChange={handleChange}>
                        <option value="">Sin categoría</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>

                    <label>URL del Sitio</label>
                    <input name="url_sitio" value={form.url_sitio} onChange={handleChange} />

                    <label>URL de Documentación</label>
                    <input name="url_documentacion" value={form.url_documentacion} onChange={handleChange} />

                    <label>URL de Imagen</label>
                    <input name="imagen_url" value={form.imagen_url} onChange={handleChange} />
                </fieldset>

                <footer>
                    <button type="submit">{isEditing ? 'Guardar Cambios' : 'Crear Elemento'}</button>
                    <button type="button" onClick={() => navigate('/catalog')}>Cancelar</button>
                </footer>
            </form>
        </main>
    );
};

export default AdminCatalog;
