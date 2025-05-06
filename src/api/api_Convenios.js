import { axiosWithAuth } from "./api_Manager";

//* Funciones CRUD para Convenion 
const getAgreement = async () => {    
    try {
        return await axiosWithAuth("/api/convenio/get/", "GET");
    } catch (error) {
        console.error("Error al obtener convenios: ", error);
        throw error;
    }
};

const addAgreement =async(newEmployeeData)=>{
    try{
        const response=await axiosWithAuth("/api/convenio/post/", "POST",newEmployeeData);
        console.log("Respuesta del backend", response.data);  // Verifica la respuesta
        return response
    }catch (error){
        console.error("Eror al crear convenio : ", error);
        throw error;
    }
};

const deleteAgreement= async(id)=>{ 
    try{
        const reponse = await axiosWithAuth(`/api/convenio/delete/${id}/`, "DELETE")

    }catch (errors){
        throw errors
    }

}


//* Funciones CRUD para Sucursales  

const getBranches = async () => {
    try{
        return await axiosWithAuth("/api/sucursal/get/", "GET");
    } catch (error) {
        console.error("Error al obtener sucursales: ", error);
        throw error;
    }
};

export {getAgreement,addAgreement, deleteAgreement, getBranches };