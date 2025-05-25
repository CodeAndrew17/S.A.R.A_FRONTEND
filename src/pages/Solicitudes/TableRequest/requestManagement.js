import { useState, useEffect } from "react";
import { addRequest, getRequest, getTipoVehiculo,patchRequest } from "../../../api/api_Solicitudes";
import { getBranches, getAgreement } from "../../../api/api_Convenios";
import { getEmployees } from "../../../api/api_Usuarios";
import { getPlanes } from "../../../api/api_Solicitudes";
import Swal from "sweetalert2";

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
        options: convenioList.map((c) => ({ value: c.id, label: c.nombre })), 
        required: true 
      },
      { name: "id_sucursal", label: "Sucursales", type: "select", placeholder: "Seleccione una Sucursal", 
        options: sucursalList.map((s) => ({ value: s.id, label: s.nombre })), 
        required: true 
      },
      {name:"telefono", label:"Teléfono", type:"text", placeholder:"Número de contacto", required:true},
      { name: "id_tipo_vehiculo", label: "Tipo de Vehiculo", type: "select", placeholder: "Seleccione un tipo de Vehiculo", options: tipovehiculoList.map((t) => ({ value: t.id, label: t.nombre_vehiculo })), required: true },
      { name: "id_plan", label: "Plan", type: "select", placeholder: "Seleccione el plan que requiere", options: planList.map((p) => ({ value: p.id, label: p.nombre_plan })), required: true },
      { name: "id_empleado", label: "Solicitado por", type: "select", placeholder: "Seleccione un empleado", options: empleadoList.map((e) => ({ value: e.id, label: `${e.nombres} ${e.apellidos}` })), required: true },
      { name: "observaciones", label: "Observaciones", type: "textarea", placeholder: "Escriba una recomendación del servicio",  fullWidth: true  }
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
      setOriginalRequest(data); // <--- Guarda los datos sin transformar

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
          id_plan: planMatch?.nombre_plan || "Sin plan",
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
    fetchRequest(); // ✅ Solo llamamos fetchRequest, que se encarga de todo
  }, []);

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
      Swal.fire({
        title: "Error",
        text: "No se pudo crear la solicitud. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  }
  const editingRequest = async (data) => {
    try {

      console.log("Data Envida", data)

      const response = await patchRequest(data.id, data);

      if (response) {
        Swal.fire({
          title: "Éxito",
          text: "La solicitud se ha modificado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        fetchRequest();
      }
    } catch (error) {
      console.error("Error al modificar la solicitud:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo modificar la solicitud. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };
const handleFiledChage = (name, value) => {
  let updatedFields = [...formsData];

  if (name === 'id_convenio') {
    const filtersucursal = sucursalList.filter(
      (s) => Number(s.id_convenio) === Number(value)
    );

    console.log("Sucursales filtradas:", filtersucursal);

    updatedFields = updatedFields.map((field) => {
      if (field.name === "id_sucursal") {
        return {
          ...field,
          options: filtersucursal.map((s) => ({
            value: s.id,
            label: s.nombre,
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

    console.log("Planes filtrados:", filteredPlans);

    updatedFields = updatedFields.map((field) => {
      if (field.name === "id_plan") {
        return {
          ...field,
          options: filteredPlans.map((p) => ({
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

  return {
    dataRequest,
    originalRequest,
    formsData,
    setFormsData,
    loading,
    fetchRequest,
    sucursalList,
    convenioList,
    empleadoList,
    planList,
    tipovehiculoList,
    fetchBaseData,
    createRequest,
    editingRequest,
    handleFiledChage
  };
};

export default useRequestManage;