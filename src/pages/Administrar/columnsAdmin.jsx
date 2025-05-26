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
    await updatePlanAdicionales(planId, nuevosAdicionales); // esta sería tu función API
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
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Modificar</span>,
      render: (valorCelda, fila) => (
        console.log("fila", fila),

        <CheckboxDropdown
          options={optionsDrop}
          selectedValues={fila.lista_adicionales || []}
          onChange={(nuevosSeleccionados) => { //pasarlo obligatoriamente
              console.log("onChange ejecutado", nuevosSeleccionados);
            }}

          onSave={(valoresSeleccionados) => {
            console.log("fila completa", fila);
            console.log("onSave ejecutandose", valoresSeleccionados);

            const idsFormularios = valoresSeleccionados.map(val => {
              if (typeof val === "string" && val.startsWith("form-")) {
                return parseInt(val.replace("form-", ""));
              } else if (typeof val === "number") {
                return val;
              } else {
                console.warn("Valor inesperado en lista_adicionales:", val);
                return null; // o podrías lanzar un error si quieres
              }
            }).filter(val => val !== null); // quitamos nulos si los hay


            handleUpdateAdicionales(fila.id, idsFormularios);
          }}
        />
      )
    },
  ];

  return { columns, selectedItems, setSelectedItems, plans };

};