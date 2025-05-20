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
    { value: "opcion8", label: "Plantilla de PMV" },
  ];

  const columns = [
    { key: "nombre", title: "Nombre" },
    { key: "vehiculo", title: "Vehiculo" },
    { key: "cuestionario", title: "Cuestionario" },
    { key: "estado", title: "Estado" },
    {
      key: "parametros",
      title: "Parametros",
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