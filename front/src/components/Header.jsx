import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.gif';

const Header = () => {
    return (
        <header>
            <Link to="/">
                <img src={logo} alt="Hub Inntek Logo" />
                <h1>Hub Inntek</h1>
            </Link>
            <nav>
                <Link to="/">Inicio</Link>
                <Link to="/catalog">Catálogo</Link>
                <Link to="/admin/categories">Categorías</Link>
            </nav>
        </header>
    );
};

export default Header;
