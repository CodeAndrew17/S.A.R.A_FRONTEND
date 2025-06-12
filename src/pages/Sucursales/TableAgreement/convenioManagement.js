
import { useState } from "react";
import { getAgreement, addAgreement, deleteAgreement, getBranches ,editAgreement} from "../../../api/api_Convenios";
import Swal from "sweetalert2";
import { Search } from "lucide-react";
import filterData from "../../../utils/unitySearch"; // funcion para filtrar los datos de la tabla
import getOrderRegister from "../../../utils/getLastRegister";


const useAgreementManagement = () => {
  const [agreements, setAgreements] = useState([]); // Estado para convenios
  const [loading, setLoading] = useState(false); // Estado para el loading
  const [filteredAgreement, setFilteredAgreement] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); //filtro añadido para estado
  const [searchText, setSearchText] = useState(""); // estado para el texto de busqueda


  // Cargar los convenios desde la API
  const fetchAgreementData = async () => {
    try {
      setLoading(true);
      const data = await getAgreement();
      setAgreements(data);
      setFilteredAgreement(data);
    } catch (error) {
      console.error("Error al cargar convenios:", error);
    } finally {
      setLoading(false);
    }
  };

  const ConsultSearch = (search) => {
    if (!search.trim()) {
      setFilteredAgreement(agreements);
      return;
    }
  
    const sanitizedSearch = search.trim().toLowerCase();
    
    const filtered = agreements.filter((con) => {
      const nitMatch = con.nit?.toString().toLowerCase().includes(sanitizedSearch);
      const nombreMatch = con.nombre?.toLowerCase()?.includes(sanitizedSearch);
      const estadoMatch = con.estado?.toLowerCase()?.includes(sanitizedSearch)
      
      return nitMatch || nombreMatch || estadoMatch;
    });
  
    setFilteredAgreement(filtered);
  };

    const filteredData = filterData({
    data: agreements, 
    searchText,
    searchFields: ["nombre", "nit"], // nombres de las columnas a buscar pasadas como array (solo nombres)
    statusField: "estado", // nombre de la columna que contiene el estado
    statusFilter // valor del filtro 
  })

  const orderData = getOrderRegister({data: filteredData});

  /*
        const handleBuscar = (search) => {
            if (!search.trim()) {
                setFilteredEmployees(employees); 
                return;
            }
        
            const sanitizedSearch = search.trim().toLowerCase(); 
        
            const filtered = employees.filter((emp) => {
                const cedulaMatch = emp.cedula?.toString().includes(sanitizedSearch);
                const nombreMatch = emp.nombres?.toLowerCase().includes(sanitizedSearch);
                const sucursalMatch = emp.id_sucursal &&
                                    sucursalesMap[emp.id_sucursal]?.toLowerCase().includes(sanitizedSearch);
                const estadoMatch= emp.estado?.toLowerCase().includes(sanitizedSearch)
                return cedulaMatch || nombreMatch || sucursalMatch || estadoMatch; 
            });
        
            setFilteredEmployees(filtered); 
        };
        
  
  */ 


  const createAgreement = async (formData) => {
    console.log("Asiendo un post")
    try {
      const telefono = parseInt(formData.telefono, 10);

      if (isNaN(telefono)) {
        throw new Error("El teléfono no es válido.");
      }

      const dataToSend = { ...formData, telefono };
      const agreementNew = await addAgreement(dataToSend);

      if (agreementNew) {
        Swal.fire({
          title: "Éxito",
          text: "El convenio se ha creado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        fetchAgreementData();
        
      }
    } catch (error) {
      console.error("Error al crear el convenio:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el convenio. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };



  // Eliminar convenios
  const removeAgreement = async (ids) => {
    if (ids.length === 0) {
      await Swal.fire({
        title: "Error",
        text: "Es necesario seleccionar al menos un Convenio para proceder con la eliminación.",
        icon: "error",
      });
      return false;
    }

    const [agreementList] = await Promise.all([getBranches()]);
    const branchesAsigandas = agreementList.filter((item) =>
      ids.includes(item.id_convenio)
    );

    const textoDinamico =
      branchesAsigandas.length > 0
        ? `Hay ${branchesAsigandas.length} sucursales con este Convenio(s). ¿Deseas continuar?`
        : "¿Deseas eliminar los Convenios seleccionados?";

    const resultado = await Swal.fire({
      title: "Revisión",
      text: textoDinamico,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return false;

    try {
      // Eliminar todos los convenios en paralelo (si el backend lo permite)
      for (const id of ids) {
        deleteAgreement(id)
        console.log("eliminados ", id )
      };
      await Swal.fire({
        title: "Convenios Eliminados",
        text: "Se eliminaron los Convenios correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      return true;
      
    } catch (error) {
      console.error("Hubo un error al eliminar los convenios.", error);
      await Swal.fire({
        title: "Error",
        text: "Ocurrió un error al eliminar los convenios. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  };

  
 const updateAgreement = async (formData, originalNit) => {
    console.log("Haciendo un PUT");
    console.log("NIT enviado desde el formulario:", formData.nit);
    console.log("NIT original del convenio:", originalNit);

    try {
        // Buscar el convenio por NIT original
        const agreement = agreements.find(a => a.nit === originalNit);

        if (!agreement) {
            throw new Error(`No se encontró un convenio con el NIT original ${originalNit}`);
        }

        // Validación y conversión segura del teléfono
        const telefono = Number.isInteger(formData.telefono) 
            ? formData.telefono 
            : parseInt(String(formData.telefono).replace(/\D/g, ''), 10);

        if (isNaN(telefono)) {
            throw new Error("El teléfono no es válido.");
        }

        console.log(`Actualizando convenio con ID: ${agreement.id}`);

        // Datos a enviar
        const dataToSend = { ...formData, telefono };

        // Llamada a la API para editar el convenio
        const agreementNew = await editAgreement(agreement.id, dataToSend);

        if (agreementNew) {
            Swal.fire({
                title: "Éxito",
                text: "El convenio se ha actualizado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            fetchAgreementData();
        }
    } catch (error) {
        console.error("Error al actualizar el convenio:", error);
        Swal.fire({
            title: "Error",
            text: error.message || "No se pudo actualizar el convenio. Verifica los datos ingresados.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
    }
};




  return {
    filteredAgreement,
    fetchAgreementData,
    createAgreement,
    removeAgreement,
    ConsultSearch,
    updateAgreement,
    filteredData,
    setStatusFilter,
    setSearchText,
    orderData,
  };
};

export default useAgreementManagement;