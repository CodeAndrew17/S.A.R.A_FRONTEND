import { addBranches, getBranches, deleteBranches, getAgreement, 
    editBranches //funcion para editarsucursales 
} from "../../../api/api_Convenios";
import {getEmployees} from "../../../api/api_Usuarios";
import Swal from "sweetalert2"; 


const useEffect = () => {
    const loadBranchesAndAgreements = async () => {}}

const handleSucursalSubmit = async (newData, setConvenios, setActiveForm, setSucursalesConvenios) => {
    try {
      console.log(newData)
      await addBranches(newData); 
  
      // Traer las sucursales y convenios actualizados
      const sucursales = await getBranches();
      const convenios = await getAgreement();
  
      // Relacionamos las sucursales con sus convenios
      const sucursalesConConvenios = sucursales.map(sucursal => {
        const convenio = convenios.find(c => c.id === sucursal.id_convenio);
        return {
          ...sucursal,
          convenio: convenio ? convenio.nombre : "Sin convenio" 
        };
      });
  
      // Actualizamos el estado de las sucursales y los convenios
      setSucursalesConvenios(sucursalesConConvenios); // Usamos setSucursalesConvenios
      setConvenios(convenios); // Si es necesario también actualizar los convenios
      setActiveForm(null); // Cierra el formulario
  
    } catch (error) {
      console.error("Error al crear la sucursal:", error);
    }
  };
  
  
  

//funcion para actualizar los datos de la tabla brnaches 
const refreshData = async (setConvenios, setSucursalesConvenios) => {
    try {
      const sucursales = await getBranches();
      const convenios = await getAgreement();
  
      const sucursalesConConvenios = sucursales.map(sucursal => {
        const convenio = convenios.find(c => c.id === sucursal.convenio);
        return {
          ...sucursal,
          convenio: convenio ? convenio.nombre : "Sin convenio"
        };
      });
  
      setConvenios(convenios);
      setSucursalesConvenios(sucursalesConConvenios);
      return sucursalesConConvenios;
  
    } catch (error) {
      console.error("Error al actualizar los datos: ", error);
      throw error;
    }
  };

const handleDeleteBranches = async (selectedIDs, setConvenios, setSucursalesConvenios) => {
    if (selectedIDs.length === 0) {
        await Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Por favor selecciona al menos una sucursal',
        });
        return { success: false };
    }

    const usuarios = await getEmployees();

    for (const id of selectedIDs) {
        const usuariosAsociados = usuarios.filter(u => u.id_sucursal === id).length;

        if (usuariosAsociados > 0) {
            const confirmar = await Swal.fire({
                title: 'Atención',
                text: `Esta sucursal tiene ${usuariosAsociados} ${usuariosAsociados === 1 ? 'usuario' : 'usuarios'} asociados. ¿Deseas continuar con la eliminación?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            });

            if (!confirmar.isConfirmed) {
                return { success: false };
            }
        }
    }

    // Confirmación general para todas las sucursales
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Vas a eliminar ${selectedIDs.length} sucursal(es). Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
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

        const successfulDeletes = results.filter(r => r.success);

        await refreshData(setConvenios, setSucursalesConvenios);

        await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: `Se eliminaron ${successfulDeletes.length}/${selectedIDs.length} sucursales.`,
        });

        return {
            success: successfulDeletes.length > 0,
            deletedCount: successfulDeletes.length,
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



const handleUpdateBranches = async (id, newData) => {
    try {
        const response = await editBranches(id, newData); // Llamada a la API para editar la sucursal
        console.log("Respuesta del backend", response.data);  
        return response;
    } catch (error) {
        console.error("Error al editar sucursal:", error);
        throw error;
    }
}


export {handleSucursalSubmit, handleDeleteBranches ,handleUpdateBranches};