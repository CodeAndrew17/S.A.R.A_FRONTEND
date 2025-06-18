import {useEffect, useState} from "react";
import {getPlans, getVehicles, addPlans, deletePlans, editPlans} from "../../api/api_Admin";
import {getRequest} from "../../api/api_Solicitudes";
import Swal from "sweetalert2";
import {handleAxiosError} from "../../utils/alertUnauthorized";

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
                    1 : "Avalúo Comercial",
                    2 : "Inspección",
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
            Swal.fire("¡Éxito!", "Plan creado correctamente", "success");

        } catch (error){
            setError(error); 
            handleAxiosError(error)
        }
    };


    const deletePlan = async (ids) => {
    try {
        const idList = Array.isArray(ids) ? ids : [ids];

        // Validar si hay solicitudes asociadas
        const solicitudes = await getRequest();
        const relacionadas = solicitudes.filter(s => idList.includes(s.id_plan));

        if (relacionadas.length > 0 && relacionadas.some(r => r.estado !== "CAL" )) {
            Swal.fire({
                title: "No se puede eliminar",
                text: `Hay ${relacionadas.length} ${relacionadas.length === 1 ? "solicitud" : "solicitudes"} asociadas a los planes. Finaliza o cancela las revisiones asociadas con este plan antes de eliminarlo.`,
                icon: "warning"
            });
            return;
        }

        // Confirmación antes de eliminar
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: `Vas a eliminar ${idList.length} plan${idList.length === 1 ? "" : "es"}. Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!confirm.isConfirmed) return;

        // Eliminar los planes
        const results = await Promise.all(
  idList.map(async (id) => {
    try {
      await deletePlans(id);
      return { success: true, id };
    } catch (error) {
      console.error(`Error eliminando plan ${id}:`, error);
      return { success: false, id, error };
    }
  })
);

const exitosos = results.filter(r => r.success);
const fallidos = results.filter(r => !r.success);

fetchAll();

if (fallidos.length > 0) {
  const err = fallidos[0].error;
  console.log("Error de Axios detectado:", err);
  handleAxiosError(err);
}

    } catch (error) {
        setError(error);
        console.error("Error al eliminar planes", error);
        console.log("pasando el catch")
        handleAxiosError(error)
    }
};

    const editPlan = async (id, newPlanData) => {
        try {
            const solicitudes = await getRequest();
            const solicitudesRelacionadas = solicitudes.filter(s=> Number(s.id_plan) == Number(id));

            if (solicitudesRelacionadas.length > 0) {
                Swal.fire({
                    title: "No se puede editar",
                    text: `Este plan está asociado a ${solicitudesRelacionadas.length } ${solicitudesRelacionadas.length === 1 ? "solicitud" : "solicitudes"}. No se puede modificar. Finalice o cancele las revisiones asociadas con este plan e inténtelo de nuevo.`,
                    icon: "warning"
                });
                return;
            }

            await editPlans(id, newPlanData);
            console.log("Plan editado con éxito", newPlanData);
            fetchAll(); //la mejor funcion jamas hecha 
            Swal.fire("¡Actualizado!", "Plan editado correctamente", "success");

        } catch (error) {
            setError(error);
            console.error("Error al editar plan", error);
            handleAxiosError(error)
        }
    };

    const updatePlanAdicionales = async (id, nuevosAdicionales) => {
        try {
            // Obtener el plan actual
            const plan = plans.find(p => p.id === id);
            if (!plan) return;

            // Obtener solicitudes relacionadas
            const solicitudes = await getRequest();
            const solicitudesRelacionadas = solicitudes.filter(s => Number(s.id_plan) === Number(id));

            if (solicitudesRelacionadas.length > 0) {
                await Swal.fire({
                    title: "Atención",
                    text: `Este cambio afectará a ${solicitudesRelacionadas.length} ${solicitudesRelacionadas.length === 1 ? "solicitud" : "solicitudes"} asociada(s) a este plan.`,
                    icon: "info",
                    confirmButtonText: "Entendido"
                });
            }

            // Editar el plan
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