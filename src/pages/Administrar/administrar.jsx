import {useState} from "react";
import Sidebar from "../../components/sidebar"; 
import styled from "styled-components";
import Table from "../../components/table";
import { useColumnsManage } from "./columnsManage";

import Toolbar from "../../components/Toolbar";
import UserForm from "../../components/userForm";
import { CheckboxDropdown } from "../../components/dropdownTwo";


import { VscTypeHierarchy } from "react-icons/vsc";

const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 10px; /* Espaciado del fondo */
  height: 60px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  line-height: 10px;
  margin: 0; /* Para que no interfiera con el diseño */
  position: relative;
  top: 20px; /* Ajusta el texto sin afectar el fondo */
`;

function Administrar() {
  const [activeForm, setActiveForm] = useState(null); // para mostrar el formulario 
  const [editingPlan, setEditingPlan] = useState(null); // para editar el plan 
  const [selectedRows, setSelectedRows] = useState([]); //para manejar las filas sleccionadas 
  const { columns, selectedItems, setSelectedItems } = useColumnsManage();


  const handleSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  console.log("Filas seleccionadas:", selectedRows);
  if (selectedRows.length > 0) {
    setEditingPlan(selectedRows[0]);
  } else {
    setEditingPlan(null);
  }
};

  const handleCrearPlan = () => {
    setEditingPlan(null); // Limpiar el estado de edición al crear una nueva sucursal
    setActiveForm("Plan"); // Mostrar el formulario cuando se hace clic en "Plan"
  };

  const handleEditPlan = ()  => {
    if (selectedRows.length === 1) {
      setActiveForm("Plan"); // Mostrar el formulario cuando se hace clic en "Plan"
    }
  };


  //esta funcion va en el otro archivo para manejar la logica de los handle 
  const handleFormSubmit = (formData) => {
    console.log("Formulario enviado", formData);

    setActiveForm(null);

  };

  const handleCancelForm = () => {
    setActiveForm(null); 
  };

  const handelDeletePlan = () => {
    alert("Eliminando el Plan...");
  };

  

  return (
    <div> 
      <Sidebar />
      <TitleWrapper>
        <TitleText>Administrar Planes</TitleText>
      </TitleWrapper>
      <Toolbar
              onCreate={handleCrearPlan}
              onEdit={handleEditPlan}
              onDelete={handelDeletePlan}
              buttonsGap="40px"
              editLabel="Editar"
              onActiveButton={true}
            >
              <Toolbar.Search 
                placeholder="Buscar..." 
                onSearch={null} 
              />
              <Toolbar.Dropdown 
                options={{
                  "activo": "Activo", 
                  "inactivo": "Inactivo",
                  "": "Todos"
                }}
              />
            </Toolbar>

      <Table
        data={[
            { id: 1, estado: 'AC', nombre: 'Plan Autosef', cuestionario: 'Avaluo Comercial', vehiculo: 'Pesados' },
            /*{ id: 2, estado: 'IN', nombre: 'Plan Basico', cuestionario: 'Inspección', vehiculo: 'Livianos' },
            { id: 3, estado: 'AC', nombre: 'Plan Premium', cuestionario: 'Avaluo Comercial', vehiculo: 'Motos' },
            { id: 4, estado: 'AC', nombre: 'Plan Plus', cuestionario: 'Inspección', vehiculo: 'Livianos' },
            { id: 5, estado: 'AC', nombre: 'Plan Ejecutivo', cuestionario: 'Diagnóstico General', vehiculo: 'Pesados' },
            { id: 6, estado: 'IN', nombre: 'Plan Empresarial', cuestionario: 'Inspección Técnica', vehiculo: 'Motos' },
            { id: 7, estado: 'AC', nombre: 'Plan Familiar', cuestionario: 'Avaluo Comercial', vehiculo: 'Livianos' },
            { id: 8, estado: 'AC', nombre: 'Plan Turbo', cuestionario: 'Inspección Especial', vehiculo: 'Pesados' },
            { id: 9, estado: 'IN', nombre: 'Plan Dinámico', cuestionario: 'Revisión Completa', vehiculo: 'Motos' },
            { id: 10, estado: 'AC', nombre: 'Plan Elite', cuestionario: 'Control de Calidad', vehiculo: 'Livianos' },
            { id: 11, estado: 'AC', nombre: 'Plan Óptimo', cuestionario: 'Inspección de Seguridad', vehiculo: 'Pesados' },
            { id: 12, estado: 'IN', nombre: 'Plan Avanzado', cuestionario: 'Evaluación Técnica', vehiculo: 'Motos' }*/
        ]}
        onSelectionChange={handleSelectionChange}
        selectable={true}
        columns={columns}
      />

      {activeForm === "Plan" && (
        <UserForm
          title={editingPlan ? "Editar Plan" : "Crear Nuevo Plan"}
          fields = {[
              { 
              name: "nombre",
              label: "Nombre del Plan",
              placeholder: "Nombre", 
              type: "text", 
              required: true 
            },
            { 
              name: "vehiculo",
              label: "Tipo de Vehículo",
              type: "select",
              options: [
                {value: "Liviano", label: "Livianos"},
                {value: "Pesado", label: "Pesados"},
                {value: "Motos", label: "Motos"}
              ],
              placeholder: "Seleccionar",
              required: true
            },
            { 
              name: "cuestionario",
              type: "select",
              label: "Cuestionario",
              options: [
                {value: "1", label: "Avaluo Comercial"},
                {value: "2", label: "Inspección"}
              ],
              placeholder: "Seleccionar",
              required: true
            },
            { 
              name: "estado",
              type: "select",
              options: [
                {value: "AC", label: "Activo"},
                {value: "IN", label: "Inactivo"}
              ],
              defaultValue: "AC",
              placeholder: "Estado",
              required: true
            }
          ]}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          initialValues={editingPlan || {}}
        />
      )}

    </div>
  );
}

export default Administrar;
