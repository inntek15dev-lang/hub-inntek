import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ nombre: '', descripcion: '' });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const resetForm = () => {
        setForm({ nombre: '', descripcion: '' });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateCategory(editingId, form);
            } else {
                await createCategory(form);
            }
            resetForm();
            fetchCategories();
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta categoría?')) return;
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (err) {
            alert('Error al eliminar: ' + err.message);
        }
    };

    if (loading) return <main><p>Cargando categorías...</p></main>;

    return (
        <main>
            <h2>Gestión de Categorías</h2>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>Nombre *</label>
                    <input
                        value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                        required
                    />
                    <label>Descripción</label>
                    <input
                        value={form.descripcion}
                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                    />
                </fieldset>
                <footer>
                    <button type="submit">{editingId ? 'Guardar Cambios' : 'Crear Categoría'}</button>
                    {editingId && <button type="button" onClick={resetForm}>Cancelar</button>}
                </footer>
            </form>

            {/* Table */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.nombre}</td>
                            <td>{cat.descripcion || '—'}</td>
                            <td>
                                <button onClick={() => handleEdit(cat)}>Editar</button>
                                <button onClick={() => handleDelete(cat.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr><td colSpan={4}>No hay categorías registradas.</td></tr>
                    )}
                </tbody>
            </table>
        </main>
    );
};

export default AdminCategories;
