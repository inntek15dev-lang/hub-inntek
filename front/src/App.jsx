import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AdminCatalog from './pages/AdminCatalog';
import AdminCategories from './pages/AdminCategories';

// Utility component to handle hash scrolling for deep linking
const ScrollToHashElement = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        }
    }, [hash]);
    return null;
};

function App() {
    return (
        <BrowserRouter>
            <ScrollToHashElement />
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/admin/catalog/new" element={<AdminCatalog />} />
                <Route path="/admin/catalog/:id/edit" element={<AdminCatalog />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
