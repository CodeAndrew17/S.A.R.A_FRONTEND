import { useState, useEffect } from "react";
import { addRequest, getRequest, getTipoVehiculo,patchRequest,deleteRequest } from "../../../api/api_Solicitudes";
import { getBranches, getAgreement } from "../../../api/api_Convenios";
import { getEmployees } from "../../../api/api_Usuarios";
import { getPlanes } from "../../../api/api_Solicitudes";
import Swal from "sweetalert2";
import {handleAxiosError} from "../../../utils/alertUnauthorized";
import { number } from "framer-motion";


const useRequestManage = () => {
  const [originalRequest, setOriginalRequest] = useState([]);
  const [dataRequest, setDataRequest] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sucursalList, setSucursalList] = useState([]);
  const [convenioList, setConvenioList] = useState([]);
  const [empleadoList, setEmpleadoList] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [tipovehiculoList, setTipoVehiculoList] = useState([]);
  const [formsData, setFormsData] = useState([]);

  
  useEffect(() => {
    setFormsData([
      { name: "placa", label: "Placa", type: "text", placeholder: "Ingresar placa del vehiculo", required: true },
      { name: "estado", label: "Estado", type: "select", 
        options: [{ value: "AC", label: "Activo" }, { value: "PRO", label: "En progreso" },{value:"CAL",label:"Cancelado"}], 
        defaultValue: "AC", 
        placeholder: "Estado", 
        required: true 
      },
      { name: "id_convenio", label: "Convenio", type: "select", placeholder: "Seleccione un convenio", 
        options: convenioList.filter(c=> c.estado =="AC").map((c) => ({ value: c.id, label: c.nombre })), 
        defaultValue: null, 
        required: true 
      },
      { name: "id_sucursal", label: "Sucursales", type: "select", placeholder: "Seleccione una Sucursal", 
        options: sucursalList.filter(s=> s.estado=="AC").map((s) => ({ value: s.id, label: s.nombre })),
        defaultValue: null, 
        required: true 
      },
      {name:"telefono", label:"Telefono", type:"text", placeholder:"Número de contacto",defaultValue: null, required:true},
      { name: "id_empleado", label: "Solicitado por", type: "select", placeholder: "Seleccione un empleado", 
        options: empleadoList.filter(e=>e.estado=="AC").map((e) => ({ value: e.id, label: `${e.nombres} ${e.apellidos}` })), 
        defaultValue: null, 
        required: true },

      { name: "id_tipo_vehiculo", label: "Tipo de Vehiculo", type: "select", placeholder: "Seleccione un tipo de Vehiculo", 
        options: tipovehiculoList.filter(t=> t.estado=="AC").map((t) => ({ value: t.id, label: t.nombre_vehiculo })), 
        defaultValue: null, 
        required: true },
      { name: "id_plan", label: "Plan", type: "select", placeholder: "Seleccione el plan que requiere", 
        options: planList.filter(p=> p.estado=="AC").map((p) => ({ value: p.id, label: p.nombre_plan })), 
        defaultValue: null, 
        required: true },
      { name: "observaciones", label: "Observación", type: "textarea", placeholder: "Escriba una recomendación del servicio",  defaultValue: null,fullWidth: true   }
    ]);
  }, [convenioList, sucursalList, empleadoList, tipovehiculoList, planList]);

  const fetchBaseData = async () => {
    try {
      const [sucursal, convenio, empleado, plan, tipovehiculo] = await Promise.all([
        getBranches(),
        getAgreement(),
        getEmployees(),
        getPlanes(),
        getTipoVehiculo()
      ]);
      setSucursalList(sucursal);
      setConvenioList(convenio);
      setEmpleadoList(empleado);
      setPlanList(plan);
      setTipoVehiculoList(tipovehiculo);

      return { sucursal, convenio, empleado, plan };
    } catch (error) {
      console.error("Error al obtener datos base:", error);
      return null;
    }
  };

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const data = await getRequest();
      setOriginalRequest(data); //  Guarda los datos origanales

      const baseData = await fetchBaseData(); 
      if (!baseData) return;

      const { sucursal, convenio, empleado, plan } = baseData;

      const enrichedData = data.map((item) => {
        const sucursalMatch = sucursal.find((s) => s.id === item.id_sucursal);
        const convenioMatch = convenio.find((c) => c.id === item.id_convenio);
        const empleadoMatch = empleado.find((e) => e.id === item.id_empleado);
        const planMatch = plan.find((p) => p.id === item.id_plan);

        return {
          ...item,
          id_sucursal: sucursalMatch?.nombre || "Sin sucursal",
          id_convenio: convenioMatch?.nombre || "Sin convenio",
          id_empleado: empleadoMatch?.correo ||  "Sin empleado",
          id_plan: planMatch?.nombre_plan || "Sin plan", //nombre del plan 
          id_real_plan: planMatch?.id || null, // este es el ID real del plan (para no confundirse)
        };
      });

      setDataRequest(enrichedData);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);
  
  //Funciona para Crear Revisiones 
  const createRequest= async (data)=>{
    try {
      console.log(data)
      const dataToSend = await addRequest(data);

      if (dataToSend) {
        Swal.fire({
          title: "Éxito",
          text: "La solicitud se ha creado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        fetchRequest()        
      }
    } catch (error) {
      console.error("Error al crear el convenio:", error);
      handleAxiosError(error);
      throw error;
    }
  }

  //Funcion para editar Revisiones 
  const editingRequest = async (data) => {
  try {
    const response = await patchRequest(data.id, data);
    if (response) {
      Swal.fire({
        title: "Éxito",
        text: "La solicitud se ha modificado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      
      // Actualizar el estado local inmediatamente
      setDataRequest(prev => prev.map(item => 
        item.id === data.id ? {...item, ...data} : item
      ));
      setOriginalRequest(prev => prev.map(item => 
        item.id === data.id ? {...item, ...data} : item
      ));
      
      // Luego hacer el fetch para asegurar consistencia con el servidor
      await fetchRequest();
    }
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

  //Funcion para aplicar filtros
  const handleFiledChage = (name, value) => {
    let updatedFields = [...formsData];

    if (name === 'id_convenio') {
      const filtersucursal = sucursalList.filter(
        (s) => Number(s.id_convenio) === Number(value)
      );

      updatedFields = updatedFields.map((field) => {
        if (field.name === "id_sucursal") {
          return {
            ...field,
            value: "", 
            options: filtersucursal
              .filter(s => s.estado == "AC")
              .map((s) => ({
                value: s.id,
                label: s.nombre,
              })),
          };
        }
        if (field.name === "id_empleado") {
          return {
            ...field,
            value: "", 
            options: [],
          };
        }
        return field;
      });
    }

    // Sucursal -> actualizar empleados
    if (name === "id_sucursal") {
      const filterempleado = empleadoList.filter(
        (e) => Number(e.id_sucursal) === Number(value)
      );

      updatedFields = updatedFields.map((field) => {
        if (field.name === "id_empleado") {
          return {
            ...field,
            value: "", 
            options: filterempleado
              .filter(e => e.estado == "AC")
              .map((e) => ({
                value: e.id,
                label: `${e.nombres} ${e.apellidos}`,
              })),
          };
        }
        return field;
      });
    }

    if (name === "id_tipo_vehiculo") {
      const filteredPlans = planList.filter(
        (p) => Number(p.id_tipo_vehiculo) === Number(value)
      );

      updatedFields = updatedFields.map((field) => {
        if (field.name === "id_plan") {
          return {
            ...field,
            options: filteredPlans.filter((f)=> f.estado=="AC").map((p) => ({
              value: p.id,
              label: p.nombre_plan,
            })),
          };
        }
        return field;
      });
    }

    setFormsData(updatedFields);
  };

  //Funcion para eliminar 
  const removeRequest = async (listIds) => {
    if (listIds.length === 0) {
      await Swal.fire({
        title: "Selección inválida",
        text: "Debe seleccionar al menos una Solicitud para eliminar.",
        icon: "warning",
      });
      return false;
    }

    const resultado = await Swal.fire({
      title: "Confirmación",
      text: "¿Quieres eliminar las revisiones seleccionadas?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return false;

    try {
      for (const id of listIds) {
        await deleteRequest(id.id);
      }

      await fetchRequest(); 

      await Swal.fire({
        title: "Solicitudes eliminadas",
        text: "Se eliminaron las solicitudes correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      return true;

    } catch (errors) {
      console.log(errors);
      handleAxiosError(errors);
      return false;
    }
  };

  return {
    originalRequest,
    dataRequest,
    formsData,
    fetchRequest,
    fetchBaseData,
    createRequest,
    editingRequest,
    removeRequest,
    handleFiledChage,
  };
};

export default useRequestManage;