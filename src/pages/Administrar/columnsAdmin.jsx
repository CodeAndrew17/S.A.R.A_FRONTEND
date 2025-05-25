import { useState, useEffect } from "react";
import { CheckboxDropdown } from "../../components/dropdownTwo";
import { getForms } from "../../api/api_Admin";


export const useColumnsManage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [optionsDrop, setOptionsDrop] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getForms(); // forms ya es un array
        console.log("todos los formularios", forms);

        const filteredOptions = forms
          .filter(form => form.id_categoria.includes(3))
          .map(form => ({
            value: `form-${form.id}`,
            label: form.nombre_formulario,
          }));

        setOptionsDrop(filteredOptions);
        console.log("opciones filtradas con id 3", filteredOptions)
      } catch (error) {
        console.error("Error al obtener formularios", error);
      }
    };

    fetchForms();
  }, []);


  const columns = [
    { key: "nombre_plan", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Nombre</span> },
    { key: "nombre_vehiculo", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Vehiculo</span> },
    { key: "nombre_cuestionario", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Cuestionario</span> },
    { key: "estado", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Estado</span> },
    {
      key: "lista_adicionales",
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Modificar</span>,
      render: (fila) => (
        <CheckboxDropdown
          options={optionsDrop}
          selectedValues={selectedItems}
          onChange={setSelectedItems}
        />
      ),
    },
  ];

  return { columns, selectedItems, setSelectedItems };
};