import { useState, useEffect } from "react";
import { getRequest } from "../../../api/api_Solicitudes";
import { getBranches, getAgreement } from "../../../api/api_Convenios";
import { getEmployees } from "../../../api/api_Usuarios";
import { getPlanes } from "../../../api/api_Solicitudes";

const useRequestManage = () => {
  const [dataRequest, setDataRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Datos de referencia cargados una vez
  const [sucursalList, setSucursalList] = useState([]);
  const [convenioList, setConvenioList] = useState([]);
  const [empleadoList, setEmpleadoList] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [formsData,setFormsData]=useState([]);

useEffect(() => {
  setFormsData([
    {
      name: "placa",
      label: "Placa",
      type: "text",
      placeholder: "Ingresar placa del vehiculo",
      required: true,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        {value: "AC", label:"Activo"},
        {value: "IN", label:"Inactivo"}
      ],
      defaultValue: "AC",
      placeholder: "Estado",
      required: true
    },
    {
      name: "id_convenio",
      label: "Convenio",
      type: "select",
      placeholder: "Seleccione un convenio",
      options: convenioList.map((c) => ({value: c.id, label: c.nombre})),
      required: true,
    },
    {
      name: "id_sucursal",
      label: "Sucursales",
      type: "select",
      placeholder: "Seleccione una Sucursal",
      options: sucursalList.map((s) => ({value: s.id, label: s.nombre})),
      required: true,
    },
    {
      name: "id_empleado",
      label: "Solicitado por",
      type: "select",
      placeholder: "Seleccione una empleado",
      options: empleadoList.map((e) => ({
        value: e.id,
        label: `${e.nombres} ${e.apellidos}`
      })),
      required: true,
    },
    {
      name: "observacion",
      label: "Observacion",
      type: "textarea",
      placeholder: "Escriba una recomendacion del servicios",
    }
  ]);
}, [convenioList, sucursalList, empleadoList]);


  const fetchBaseData = async () => {
    try {
      const [sucursal, convenio, empleado, plan] = await Promise.all([
        getBranches(),
        getAgreement(),
        getEmployees(),
        getPlanes(),
      ]);
      setSucursalList(sucursal);
      setConvenioList(convenio);
      setEmpleadoList(empleado);
      setPlanList(plan);
    } catch (error) {
      console.error("Error al obtener datos base:", error);
    }
  };

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const data = await getRequest();
      fetchBaseData()

      const enrichedData = data.map((item) => {
        const sucursalMatch = sucursalList.find((s) => s.id === item.id_sucursal);
        const convenioMatch = convenioList.find((c) => c.id === item.id_convenio);
        const empleadoMatch = empleadoList.find((e) => e.id === item.id_empleado);
        const planMatch = planList.find((p) => p.id === item.id_plan);

        return {
          ...item,
          id_sucursal: sucursalMatch?.nombre || "Sin sucursal",
          id_convenio: convenioMatch?.nombre || "Sin convenio",
          id_empleado: `${empleadoMatch?.nombres || "Sin"} ${empleadoMatch?.apellidos || "empleado"}`,
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
    // Primero carga las listas base y luego las solicitudes
    const init = async () => {
      await fetchBaseData();
      await fetchRequest();
    };
    init();
  }, []);

  return {
    dataRequest,
    formsData,
    loading,
    fetchRequest, // para recargar las solicitudes si lo necesitas manualmente
    sucursalList,
    convenioList,
    empleadoList,
    planList,
  };
};

export default useRequestManage;
