import { addBranches, getBranches, deleteBranches, getAgreement, 
    editBranches //funcion para editarsucursales 
} from "../../../api/api_Convenios";
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
        await refreshData(setConvenios, setSucursalesConvenios);

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
