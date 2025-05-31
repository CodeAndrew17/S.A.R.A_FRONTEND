//funcion unitaria para usar en los foltros del toolbar - ejemplo de uso mas abajo 
    const normalizeText = (text) =>
    text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filterData = ({
    data,
    searchText,
    searchFields = [],
    statusField = null,
    statusFilter = ""
    }) => {
    const search = normalizeText(searchText);
    const normalizedStatusFilter = normalizeText(statusFilter);

    return data.filter((item) => {
        const matchesSearch = searchFields.some((field) =>
        normalizeText(item[field] || "").includes(search)
        );

        const matchesStatus =
        !statusField ||
        normalizedStatusFilter === "" ||
        (normalizedStatusFilter === "activo" &&
            normalizeText(item[statusField]) === "ac") ||
        (normalizedStatusFilter === "inactivo" &&
            normalizeText(item[statusField]) === "in") ||
        normalizeText(item[statusField]) === normalizedStatusFilter; //  esto permite que funcione con "AC", "IN", etc.


        return matchesSearch && matchesStatus;
    });
    };

    export default filterData;

/* uso funcion SearchFilter

import .. from 'utils/unitySearch'; importamos funcion 

declarar los dos hooks q usa la funcion searchText y statusFilter

const filteredData = filterData({
    data: data que renderiza la table, el array de objetos 
    searchText, estado q se debe establcer donde se valla a usar la funcion (hook useState)
    searchFields: [nombres de las columnas a buscar pasadas como array (solo nombres)],
    statusField: "estado", // nombre de la columna que contiene el estado
    statusFilter: // valor del filtro tambien hace uso del hook useState
})

ejemplo de uso practico y completo en los filtros de la tabla sucursales (archivo sucursales.jsx)

*/ 