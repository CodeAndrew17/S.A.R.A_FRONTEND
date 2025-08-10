
import { axiosWithAuth, axiosWithAuthFile } from "./api_Manager";

//! Peticiones Get 
const getPlanes= async()=>{
    try{
        return await axiosWithAuth("/api/plan/get/")
    }
    catch(errors){
        throw errors
    }
}
const getRequest = async () =>{
    try{

        return await axiosWithAuth("/request/api/solicitud/get/","GET");
    }
    catch(errors){
        console.log({'Erros':errors})
        throw errors

    }

}
const getTipoVehiculo = async ()=>{
    try{

        return await axiosWithAuth("/api/tipovehiculo/get/","GET")

    }catch(errors){
        console.log({'Erros':errors})

        throw errors
    }
}

//Post 
const addRequest =  async (newRequestData)=>{
    try{
        return await axiosWithAuth("/request/api/solicitud/post/","POST",newRequestData)

    }catch(errors){
        console.log(errors)
        throw errors
    }
}

const patchRequest = async(id,editRequestData) =>{
    try{
        return await axiosWithAuth(`/request/api/solicitud/patch/${id}/`,"PATCH",editRequestData)
        

    }catch(errors){
        console.log(errors)
        throw errors

    }
}
const deleteRequest =async(id)=>{
    try {
        return await axiosWithAuth(`/request/api/solicitud/delete/${id}/`,"DELETE")
    } catch(error){
        console.log(error)
        throw error        
    }
}

//api get para descargar el informe de la solicitud con el id 
const downloadRequest = async (id) => {
    try {
        const response =  await axiosWithAuthFile(`/result/api/descarga/reporte/${id}/`, "GET");
        return response; //aqui devolvemos la respuesta completa que seria el blob del archivo descargado (esto aun no lo descarga)
    } catch (error) {
        console.error("Error al descargar el informe:", error);
        throw error;
    }
};


export {getRequest,getPlanes,getTipoVehiculo,addRequest,patchRequest,deleteRequest, downloadRequest}