import { axiosWithAuth } from "./api_Manager";

//* Funciones CRUD para Convenios
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

const addBranches = async (newBranchesData) => {
    try {
        return await axiosWithAuth("/api/sucursal/post/", "POST", newBranchesData)
    }  catch (error) {
        console.error("Error al crear sucursal:", error);
        throw error;
    }
};

const deleteBranches = async (id) => {
    try{
        return await axiosWithAuth(`/api/sucursal/delete/${id}/`, "DELETE");
    } catch (error) {
        console.error("Error al eliminar sucursale(s):", error);
        throw error;
    }
};

const editBranches = async (id, newBranchData) => {
    try {
        return await axiosWithAuth(`/api/sucursal/patch/${id}/`, "PATCH", newBranchData);
    } catch (error) {
        console.error("Error al editar sucursal:", error);
        throw error;
    }
};



export {getAgreement,addAgreement, deleteAgreement, getBranches, addBranches, deleteBranches, editBranches};