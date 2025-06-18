import { useState, useEffect } from "react";
import { CheckboxDropdown } from "../../components/dropdownTwo";
import { getForms } from "../../api/api_Admin";
import usePlansandVehicles from "./adminManager";
import Swal from "sweetalert2";


export const useColumnsManage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [optionsDrop, setOptionsDrop] = useState([]);

  const {plans, updatePlanAdicionales} = usePlansandVehicles();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getForms(); // forms ya es un array
        //console.log("todos los formularios", forms);

        const filteredOptions = forms
          .filter(form => form.id_categoria.includes(3))
          .map(form => ({
            value: `form-${form.id}`,
            label: form.nombre_formulario,
          }));

        setOptionsDrop(filteredOptions);
        console.log("opciones filtradas con id 3", filteredOptions)
      } catch (error) {
        //console.error("Error al obtener formularios", error);
      }
    };

    fetchForms();
  }, []);

  const handleUpdateAdicionales = async (planId, nuevosAdicionales) => {
    console.log("llmando a la api ", planId, nuevosAdicionales);
  try {
    await updatePlanAdicionales(planId, nuevosAdicionales); 
    Swal.fire({
      icon: "success",
      title: "Adicionales actualizados",
      timer: 1500,
      showConfirmButton: false
    });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Intenta nuevamente"
      });
    }
  };



  const columns = [
    { key: "nombre_plan", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Nombre</span> },
    { key: "nombre_vehiculo", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Vehiculo</span> },
    { key: "nombre_cuestionario", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Cuestionario</span> },
    { key: "estado", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Estado</span> },
    {
      key: "lista_adicionales",
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Adicionales</span>,
      render: (valorCelda, fila) => (
        <CheckboxDropdown
          options={optionsDrop}
          selectedValues={(fila.lista_adicionales || []).map(id => `form-${id}`)}
          onChange={(nuevosSeleccionados) => {
            console.log("onChange ejecutado", nuevosSeleccionados);
          }}
          onSave={(valoresSeleccionados) => {
            const idsFormularios = valoresSeleccionados.map(val => {
              if (typeof val === "string" && val.startsWith("form-")) {
                return parseInt(val.replace("form-", ""));
              } else if (typeof val === "number") {
                return val;
              } else {
                return null;
              }
            }).filter(val => val !== null);

            handleUpdateAdicionales(fila.id, idsFormularios);
          }}
        />
      )
    },
  ];

  return { columns, selectedItems, setSelectedItems, plans };

};
