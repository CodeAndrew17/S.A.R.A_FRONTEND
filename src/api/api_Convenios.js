import { axiosWithAuth } from "./api_Manager";

const getConvenios = async () => {    
    try {
        return await axiosWithAuth("/api/convenio/get/", "GET");
    } catch (error) {
        console.error("Error al obtener convenios: ", error);
        throw error;
    }
};


export {getConvenios};