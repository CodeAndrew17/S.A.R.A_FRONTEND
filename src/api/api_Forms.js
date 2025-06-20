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

const addAnswers = async (answerData) => {
    try {
        const response = await axiosWithAuth("/result/api/resultado/post/", "POST", answerData)
        return response
    } catch (error) {
        console.error("Error al enviar las respuestas: ", error)
        throw error;
    }
}

//funciona para traer las respuesta del formulario (no confundir con las opciones de los selects)
const getAnswers = async (id_solicitud, id_formulario) => {
    try {
        const response = await axiosWithAuth(`/result/api/resultado/get/${id_solicitud}/${id_formulario}/`, "GET")
        return response
    } catch (error) {
        console.error("Error al enviar las respuestas: ", error)
        throw error;
    }
}

export {getFormItems, getCategoryOptions, addAnswers, getAnswers}