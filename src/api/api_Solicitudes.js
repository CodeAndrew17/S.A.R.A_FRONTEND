import { Await } from "react-router-dom";
import { axiosWithAuth } from "./api_Manager";

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

export {getRequest,getPlanes}