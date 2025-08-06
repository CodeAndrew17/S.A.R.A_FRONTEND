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
        if (error.response && error.response.status === 404) {
            return []; // si no hay respuestas no lazamos el error si no dejamos null para q no se llene de errores la consola 
        } //retornamos el array vacio para que no se rompa el componente ya que espera un array 
        console.error("Error al enviar las respuestas: ", error)
        throw error; //otros errores diferentes si se capturan
    }
}

const editAnswers = async (updateData) => {
    try {
        return await axiosWithAuth(`/result/api/resultado/put/`, "PUT", updateData);
    } catch (error) {
        console.error("Error al editar el Form", error);
        throw error;
    }
};

//ruta para subir imagenes (no se uso porque se declara directamente donde se usa el componente imageForm) 
const uploadImage = async (formData) => {
    try {
        return await axiosWithAuth("/result/api/subirimagen/post/", "POST", formData);
    } catch (error) {
        console.error("error al subir la imagen", error);
    }
}

//ruta para teminar una solicitud 
const finishRequest = async (id_solicitud) => {
    try {
        return await axiosWithAuth(`/result/api/finalizar/get/${id_solicitud}/`, "GET");
    } catch (error) {
        console.error("Error al finalizar la solicitud", error);
        throw error;
    }
}

export {getFormItems, getCategoryOptions, addAnswers, getAnswers, editAnswers, uploadImage, finishRequest}