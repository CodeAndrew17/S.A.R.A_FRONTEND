import { axiosWithAuth } from './api_Manager';

//Funcion para obtener todos los usuarios
const getEmployees = async () => {
    try {
        return await axiosWithAuth("/access/api/empleado/get/", "GET");
    } catch(error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
};

const deleteEmployees = async (id) => {
    try {
        return await axiosWithAuth(`/access/api/empleado/delete/${id}/`, "DELETE");
    } catch(error) {
        console.error("Error al intentar eliminar usuario",error);
        throw error; 
    }
};

const editEmployees = async (id, updateData) => {
    try{
        return await axiosWithAuth(`/access/api/empleado/put/${id}/`, "PUT", updateData);
    } catch (error) {
        console.error("error al editar usuario", error);
        throw error;
    }
};

const addEmployees = async (newEmployeeData) => {
    try {
        return await axiosWithAuth("/access/api/empleado/post/","POST", newEmployeeData);
    } catch (error) {
        console.error("Error al agregar usuario", error);
        throw error;
    }
};

//funcion para solicitar los nombres de las sucursales y mostralos en los empleados 
const getBranches = async () => {
    try {
        return await axiosWithAuth("/access/api/sucursal/get/", "GET");
    } catch (error) {
        console.error("Error al obtener sucursales:", error);
        throw error;
    }
};

const getUsers = async () => {
    try{
        return await axiosWithAuth("/access/api/usuario/get/", "GET");
    } catch (error) {
        console.error("Error al obtener usuarios", error);
        throw error;
    }
};

const addUsers = async (UserData) => {
    try{
        return await axiosWithAuth("/access/api/usuario/post/", "POST", UserData);
    } catch (error){
        console.error("error al asignar usuario", error);
        throw error; 
    }
};

const deleteUsers = async (id) => {
    try{
        return await axiosWithAuth(`/access/api/usuario/delete/${id}/`, "DELETE");
    } catch (error){
        console.error("error al eliminar usuario", error);
        throw error; 
    }
};

const editUsers = async (id, updateDataUser) => {
    try{
        return await axiosWithAuth(`/access/api/usuario/put/${id}/`, "PUT", updateDataUser);
    } catch (error) {
        console.error("error al editar la informacion de usuario", error);
        throw error; 
    }
};

export {getEmployees, deleteEmployees, editEmployees, addEmployees, getBranches, getUsers, addUsers, deleteUsers, editUsers};