import { addPlans, getPlans, deletePlans, editPlans, getVehicles } from "../../../api/api_Admin";
import Swal from "sweetalert2";
import { handleDeleteBranches } from "../../Sucursales/TableBranches/sucursalManagement";

const handlePaqueteSubmit = async (newData, setPlanes, setActiveForm, setVehiculosPlanes) => {
    try {
        await addPlans(newData);

        const planes = await getPlans();
        const vehiculos = await getVehicles();

        const VehiculoConPlan = vehiculos.map(vehiculo => {
            const plan = planes.find(c => c.id === vehiculo.id_plan);
            return {
                ...vehiculo,
                plan: plan?.nombre || "Sin plan"
            };
        });

        //actualizar estados
        setVehiculosPlanes(VehiculoConPlan);
        setFilteredPacks(VehiculoConPlan);
        setPlanes(planes);
        setPacksOptions(planes);
        setActiveForm(null);

    } catch (error) {
        console.error("Error cargando los datos: ", error);
        throw error;
    };

};

const refreshData = async (setPlanes, setVehiculosPlanes) => {
    try {

        const planes = await getPlans();
        const vehiculos = await getVehicles();

        const VehiculoConPlan = vehiculos.map(vehiculo => {
            const plan = planes.find(c => c.id === vehiculo.id_plan);
            return {
                ...vehiculo,
                plan: plan?.nombre || "Sin plan"
            };
        });

        //actualizar estados
        setPlanes(planes);
        setVehiculosPlanes(VehiculoConPlan);
        return VehiculoConPlan;

    } catch (error) {
        console.error("Error cargando los datos: ", error);
        throw error;
    };

};

const handleDeletePaquetes = async (selectedIDs, setPlanes, setVehiculosPlanes) => {
    if (selectedIDs.length === 0) {
        await Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Por favor seleccione al menos un paquete',
        });
        return { success: false };
    }

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Vas a eliminar ${selectedIDs.length} Paquete(s)`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return { success: false };

    try {
        const results = await Promise.all(
            selectedIDs.map(async (id) => {
                try {
                    await deleteBranches(id);
                    return { success: true, id };
                } catch (error) {
                    console.error(`Error eliminando sucursal ${id}:`, error);
                    return { success: false, id, error };
                }
            })
        );

        const succesfullDeletes = results.filter(r => r.success);

        await refreshData(setPlanes, setVehiculosPlanes);

        await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: `Se eliminaron ${succesfullDeletes.length}/${selectedIDs.length} paquetes`,
        });

        return {
            success: succesfullDeletes.length > 0,
            deletedCount: succesfullDeletes.length
        };

    } catch (error) {
        console.error('Error general:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error durante el proceso',
        });
        return { success: false, error };
    }
};

const handleUpdatePaquetes = async (id, newData) => {
    try {
        const response = await editPlans(id, newData);
        console.log("Respuesta del backend: ", response.data);
        return response;
    } catch (error) {
        console.error("Error al editar el plan: ", error)
        throw error;
    }
}

export {handlePaqueteSubmit, handleDeletePaquetes, handleUpdatePaquetes}