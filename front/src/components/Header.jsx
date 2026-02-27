import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.gif';

const Header = () => {
    const { isAuthenticated, canRead, logout, user } = useAuth();

    return (
        <header>
            <Link to="/">
                <img src={logo} alt="Hub Inntek Logo" />
                <h1>Hub Inntek</h1>
            </Link>
            <nav>
                <Link to="/">Inicio</Link>
                <Link to="/catalog">Catálogo</Link>
                {isAuthenticated && canRead('Categorias') && (
                    <Link to="/admin/categories">Categorías</Link>
                )}
                {isAuthenticated ? (
                    <button onClick={logout}>{user?.nombre || 'Salir'} ✕</button>
                ) : (
                    <Link to="/login">Admin</Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
