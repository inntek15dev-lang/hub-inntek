import React from 'react';
import classNames from 'classnames';

const CatalogCard = ({ element }) => {
    return (
        <div className={classNames("bg-white rounded-lg shadow-md p-4 flex flex-col gap-2")}>
            <img src={element.imagen_url || '/vite.svg'} alt={element.titulo} className="h-32 object-contain" />
            <h3 className="text-lg font-bold text-blue-900">{element.titulo}</h3>
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded inline-block max-w-max">
                {element.tipo_producto}
            </span>
            <p className="text-sm text-gray-600 flex-1">{element.detalle}</p>
            <div className="flex gap-2 mt-4">
                {element.url_sitio && (
                    <a href={element.url_sitio} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-sm px-3 py-1 rounded">Ir al Sitio</a>
                )}
                {element.url_documentacion && (
                    <button className="border border-blue-600 text-blue-600 text-sm px-3 py-1 rounded">Ver Documentación</button>
                )}
            </div>
        </div>
    );
};

export default CatalogCard;
