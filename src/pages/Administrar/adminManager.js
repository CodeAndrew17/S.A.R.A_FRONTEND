import {useEffect, useState} from "react";
import {getPlans, getVehicles, addPlans, deletePlans, editPlans} from "../../api/api_Admin";

const usePlansandVehicles = () => {
    const [plans, setPlans] = useState([]); // Estado para almacenar los planes
    const [vehicles, setVehicles] = useState([]); // estado para alamcenar los vehiculo 
    const [loading, setLoading] = useState(true); // estado para manejar el lapso de carga de datos en la tabla
    const [error, setError] = useState(null); // estado para manejar los errores 
    const [search, setSearch] = useState(""); // para manejar los filtros del search 


        const fetchAll = async () => { //dejamos la funcion afuera del useEffecta para reutilizarla en el refresh de cuando se modifica la tabla
            try {

                const [plansData, vehiclesData] = await Promise.all([
                    getPlans(), //obtenemos los planes
                    getVehicles() // obtenemos vehiculos
                ]);

                const cuestionariosMap = {
                    1 : "Avaluo Comercial",
                    2 : "Inspeccion",
                    3 : "Adicionales"
                }

                const vehiclesList = vehiclesData.Data || vehiclesData; //verificameos si nececitamos acceder al .data 

                const plansConVehicle = plansData.map(plan => {
                    const vehicle = vehiclesList.find(v => Number(v.id) === Number(plan.id_tipo_vehiculo)); // hacemos la relaciondonde llave foranea y id de vehiculo coincidan 
                    return { // lo del number es para evitar errores de comparacion entre string e integer
                        ...plan,
                        nombre_vehiculo: vehicle?.nombre_vehiculo || "Desconocido", // copia exactamente igual y le añadimos el nombre del vehiculo
                        nombre_cuestionario: cuestionariosMap[plan.cuestionario] || "Desconocido" // añadimos el nombre del cuestionario con datos estaticos (mas adelante cambiar)
                    };
                });

                console.log("planes con vehiculos ", plansConVehicle); // depuracion de datos

                setPlans(plansConVehicle); // almacenamos planes relacionados con vehiculos para ver la informacion en la tabla
                setVehicles(vehiclesData); // almacenamos lo vehiculos en el state creado para vehiculos 
            }catch (error) {
                setError(error);
                console.error("Error al cargar los datos: ", error);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => { // ejecuta fetch all una sola vez
        fetchAll();
            }, []);



    const submitPlan = async (newPlanData) => {
        try {
            await addPlans(newPlanData); // lamamos a la api para agregar el nuevo plan 
            fetchAll(); // reutilizamos la funcion para cargar los datos de nuevo y actualizar la tabla

        } catch (error){
            setError(error); 
        }
    };


    const deletePlan = async (id) => {
        try {
            await deletePlans(id); //llamamos a la api para eliminar el plan
            fetchAll(); //refrescamos tabla
        } catch(error) {
            setError(error); 
        }
    };

    const editPlan = async (id, newPlanData) => {
        try {
            await editPlans(id, newPlanData);
            console.log("Plan editado con éxito", newPlanData);
            fetchAll(); //la mejor funcion jamas hecha 

        } catch (error) {
            setError(error);
            console.error("Error al editar plan", plan);
        }
    };

    const updatePlanAdicionales = async (id, nuevosAdicionales) => {
    try {
        // Obtener el plan actual
        const plan = plans.find(p => p.id === id);
        if (!plan) return;

        // Hacer un patch o edit, enviando la nueva lista
        const newPlanData = { ...plan, lista_adicionales: nuevosAdicionales };
        await editPlans(id, newPlanData);

        // Refrescar planes
        fetchAll();
    } catch (error) {
        setError(error);
        console.error("Error actualizando adicionales", error);
    }
    };



    return {plans, vehicles, loading,  error , submitPlan, deletePlan, editPlan, updatePlanAdicionales}; // retornamos los datos para ser utilizados en el componente  
    // plans soporta toda la informacion a mostra en la tabla con los datos relacionados
};

export default usePlansandVehicles;