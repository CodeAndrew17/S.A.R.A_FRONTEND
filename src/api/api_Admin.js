import axios from "axios";
import { axiosWithAuth } from "./api_Manager";
import { EraserIcon } from "lucide-react";


//* CRUD Para administrar(planes)
const getPlans = async () => {
    try {
        return await axiosWithAuth("/api/plan/get/", "GET");
    } catch (error) {
        console.error("Error al cargar los planes: ", error);
        throw error;
    }
};

const addPlans = async (newPlanData) => {
    try {
        const response = await axiosWithAuth("/api/plan/post/", "POST", newPlanData);
        return response
    } catch (error) {
        console.error("Error al enviar el nuevo plan al backend: ", error);
        throw error;
    }
};

const editPlans = async (id, newPlanData) => {
    try {
        return await axiosWithAuth(`/api/plan/patch/${id}/`, "PATCH", newPlanData);
    } catch (error) {
        console.error("Error al actualizar el plan", error);
        throw error;
    }
};

const deletePlans = async (id) => {
    try {
        return await axiosWithAuth(`/api/plan/delete/${id}/`, "DELETE")
    } catch (error) {
        console.error("Error al eliminar el plan", error);
        throw error;
    }
};


//* CRUD para vehiculos
////////////////////////////////////////////////////////////////////
const getVehicles = async () => {
    try{
        return await axiosWithAuth("/api/TipoVehiculo/get/", "GET");
    } catch (error) {
        console.error("Error al cargar los vehiculos: ", error);
        throw error;
    }
};
////////////////////////////////////////////////////////////////////

const addVehicles = async (newVehicleData) =>{ //esta funcion para vehiculos nunca se usó por ahora 
    try{
        const response = await axiosWithAuth("/api/TipoVehiculo/post/", "POST", newVehicleData);
        return response;
    } catch (error) {
        console.error("Error al crear el vehiculo: ", error);
        throw error;
    }
};

const editVehicles = async (id, newVehicleData) => {
    try{
        return await axiosWithAuth(`/api/TipoVehiculo/patch/${id}/`, "PATCH", newVehicleData)
    } catch (error) {
        console.error("Error al editar el vehiculo: ", error);
        throw error;
    }
};

const deleteVehicles = async (id) => {
    try{
        return await axiosWithAuth(`/api/TipoVehiculo/delete/${id}/`, "DELETE");
    } catch (error) {
        console.error("Error al eliminar el vehiculo: ", error)
        throw error;
    }
};

const getForms = async () => {
    try {
        const response = await axiosWithAuth(`/api/formulario/get/`, "GET");
        return response;
    } catch (error) {
        console.error("Error al cargar los formularios: ", error);
        throw error;
    }
};


export{getPlans,addPlans,editPlans,deletePlans, getVehicles, addVehicles, editVehicles, deleteVehicles, getForms};