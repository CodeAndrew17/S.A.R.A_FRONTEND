import axios from 'axios';
import { axiosWithAuth, axiosWithAuthFile  } from './api_Manager';

const getRequestYear = async (year) => {
    try {
        const endpoint = `/statistic/api/solicitud/${year}/`; //recordar SIEMPRE poner el / al inicio y al final de la ruta
                console.log(endpoint);
        return await axiosWithAuth(endpoint, "GET");
    } catch (error) {
        console.error("Error al obtener las solicitudes", error);
        return [];
    }
};


const getRequestMonth = async (year, month) => {
    try {
        return await axiosWithAuth(`/statistic/api/solicitud/${year}/${month}`, "GET")
    } catch (error) {
        console.error("Error al obtener las solicitudes", error);
        return [];
    }
}

const getPlans = async () => {
    try {
        return await axiosWithAuth("/statistic/api/planes", "GET")
    } catch (error) {
        console.error("Error al obtener los planes", error);
        return [];
    }
}

const getReport = async () => {
    try {
        return await axiosWithAuthFile("/statistic/api/reportesexcel/", "GET");
    } catch (error) {
        console.error("Error al obtener el reporte", error);
    }
}

//hacer la peticion para obtener el reporte usar la otra variante de axioswithAuth para archivos blob osea xlsx

export {getRequestYear, getRequestMonth, getPlans, getReport}