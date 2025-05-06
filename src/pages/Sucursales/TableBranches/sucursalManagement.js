import { addBranches, getBranches, deleteBranches } from "../../../api/api_Convenios";
import Swal from "sweetalert2";


//funcion para enviar los datos del formulario al backend y actualizar la tabla 
const handleSucursalSubmit = async (newData,setConvenios,setActiveForm) => {
    try{
        await addBranches(newData);
        const updateData = await getBranches();
        setConvenios(updateData);
        setActiveForm(false);
        return { success: true};
    } catch (error) {
        console.error("Error al crear la sucursal", error);
        return {success:false, error};
    }
};

//funcion para actualizar los datos de la tabla brnaches 
const refreshData = async (setConvenios) => {
    try {
        const updateData = await getBranches();
        setConvenios(updateData);
        return updateData;
    } catch (error) {
        console.error("Error al actualizar los datos: ", error);
        throw error;
    }
}; 

const handleDeleteBranches = async (selectedIDs, setConvenios) => {
    if (selectedIDs.length === 0) { //existen los seleccionados?
        await Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Por favor selecciona al menos una sucursal',
        });
        return { success: false };
    }

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Vas a eliminar ${selectedIDs.length} sucursal(es)`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return { success: false };

    try {
        const results = await Promise.all( // realisamos las peticiones en paralelo para mayor eficiencia
            selectedIDs.map(async (id) => { //mapeamos por cada id seleccionado para ejcutar la peticion
                try {
                    await deleteBranches(id);
                    return { success: true, id };
                } catch (error) {
                    console.error(`Error eliminando sucursal ${id}:`, error);
                    return { success: false, id, error };
                }
            })
        );

        const successfulDeletes = results.filter(r => r.success);
        
        // Actualización condicional
        await refreshData(setConvenios);

        await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: `Se eliminaron ${successfulDeletes.length}/${selectedIDs.length} sucursales`,
        });

        return { 
            success: successfulDeletes.length > 0,
            deletedCount: successfulDeletes.length
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


export {handleSucursalSubmit, handleDeleteBranches};