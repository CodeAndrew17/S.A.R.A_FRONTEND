import { axiosWithAuth } from "./api_Manager";

const getConvenios = async () => {    
    try {
        return await axiosWithAuth("/api/convenio/get/", "GET");
    } catch (error) {
        console.error("Error al obtener convenios: ", error);
        throw error;
    }
};

const addConvenios =async(newEmployeeData)=>{
    try{
        const response=await axiosWithAuth("/api/convenio/post/", "POST",newEmployeeData);
        console.log("Respuesta del backend", response.data);  // Verifica la respuesta
        return response
    }catch (error){
        console.error("Eror al crear convenio : ", error);
        throw error;
    }
};

const getSucursales = async () => {
    try{
        return await axiosWithAuth("/api/sucursal/get/", "GET");
    } catch (error) {
        console.error("Error al obtener sucursales: ", error);
        throw error;
    }
};

export {getConvenios, addConvenios, getSucursales};