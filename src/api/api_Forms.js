import axios from "axios";
import { axiosWithAuth } from "./api_Manager";


const getFormItems = async (id) => {
    try {
        const response = await axiosWithAuth(`/request/api/itemslist/get/${id}/`);
        return response;
    } catch (error) {
        console.error("Error al obtener los items del formulario ", error);
        return [];
    }
}

const getCategoryOptions = async (id_categoria_opciones) => {
    try{
        const response = await axiosWithAuth(`/api/opciones/id_categoria_opciones/${id_categoria_opciones}/get/`);
        return response;
    } catch (error) {
        console.error("Error al cargar las opciones ", error)
    }
}

export {getFormItems, getCategoryOptions}