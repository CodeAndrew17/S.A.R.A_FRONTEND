import { useState } from "react";
import { CheckboxDropdown } from "../../components/dropdownTwo";

export const useColumnsManage = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const optionsDrop = [
    { value: "opcion1", label: "Prueba de vacio(PMV)" },
    { value: "opcion2", label: "Impronta" },
    { value: "opcion3", label: "Fotos" },
    { value: "opcion4", label: "Dinamometro" },
    { value: "opcion5", label: "Prueba de compresión" },
    { value: "opcion6", label: "Prueba de Gasolina" },
    { value: "opcion7", label: "Novedades" },
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