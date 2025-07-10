
import { axiosWithAuth } from "./api_Manager";

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
    try{
        return await axiosWithAuth(`/request/api/solicitud/delete/${id}/`,"DELETE")

    }catch(errros){
        console.log(errros)
        throw errros        

    }

}


export {getRequest,getPlanes,getTipoVehiculo,addRequest,patchRequest,deleteRequest}