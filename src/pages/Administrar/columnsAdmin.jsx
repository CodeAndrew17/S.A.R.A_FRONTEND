import { useState } from "react";
import { CheckboxDropdown } from "../../components/dropdownTwo";

export const useColumnsManage = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const optionsDrop = [
    { value: "opcion1", label: "Plantilla Vehiculo " },
    { value: "opcion2", label: "Caracteristicas del Vehiculo" },
    { value: "opcion3", label: "Plantilla de Cliente" },
    { value: "opcion4", label: "Plantilla de Accesorios" },
    { value: "opcion5", label: "Plantilla de Novedades" },
    { value: "opcion6", label: "Plantilla de Improntas" },
    { value: "opcion7", label: "Plantilla de PCM" },
    { value: "opcion8", label: "Plantilla de PMV" }, //datos estaticos de prueba
  ];

  const columns = [
    { key: "nombre_plan", title: <span style={{fontSize: '14px', fontWeight: 'bold'}}>Nombre</span> },
    { key: "nombre_vehiculo", title:<span style={{fontSize: '14px', fontWeight: 'bold'}}>Vehiculo</span> },
    { key: "nombre_cuestionario", title: <span style={{fontSize: '14px', fontWeight: 'bold'}}>Cuestionario</span>},
    { key: "estado", title: <span style={{fontSize: '14px', fontWeight: 'bold'}}>Estado</span> },
    {
      key: "lista_adicionales",
      title: <span style={{fontSize: '14px', fontWeight: 'bold'}}>Modificar</span>,
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