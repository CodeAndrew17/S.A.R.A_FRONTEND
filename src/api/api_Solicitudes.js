import { Await } from "react-router-dom";
import { axiosWithAuth } from "./api_Manager";


const getRequest = async () =>{
    try{

        return await axiosWithAuth("/request/api/solicitud/get/","GET");
    }
    catch(errors){
        console.log({'Erros':errors})
        throw errors

    }

}

export {getRequest}