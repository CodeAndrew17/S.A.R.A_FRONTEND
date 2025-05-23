import {useState} from "react";
import Sidebar from "../../components/sidebar"; 
import styled from "styled-components";
import Table from "../../components/table";
import { useColumnsManage } from "./columnsAdmin";

import Toolbar from "../../components/toolbar";
import UserForm from "../../components/userForm";
import { CheckboxDropdown } from "../../components/dropdownTwo";

import { VscTypeHierarchy } from "react-icons/vsc";

import usePlansandVehicles from "./adminManager"; //funciones para manejar datos
import { toast } from "react-toastify";


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
  const [selectedRows, setSelectedRows] = useState([]); //para manejar las filas seleccionadas 

  const { columns, selectedItems, setSelectedItems } = useColumnsManage();

  const { plans, vehicles, loading, error, submitPlan, deletePlan, editPlan } = usePlansandVehicles(); // Llama al hook usePlans para usar sus funciones y estados
  
  //funcion para manejar la seleccion de filas y acceder a su id para modificarlas en el edit y delete
  const handleSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  console.log("Filas seleccionadas:", selectedRows);
  if (selectedRows.length > 0) {
    setEditingPlan(selectedRows[0]);
  } else {
    setEditingPlan(null);
  }
};

//preparamos la interfaz para la creacion de un nuevo plan
  const handleCrearPlan = () => {
    setEditingPlan(null); // Limpiar el estado de edición al crear una nueva sucursal
    setActiveForm("Plan"); // Mostrar el formulario cuando se hace clic en "Plan"
  };

  //capturamos los datos del formualrio y los enviamos a la api con la logica de submitPlan para actualizar los datos en table tambien usamos editPlan para eficiencia 
  const handleFormSubmit = async (formData) => {
    try {
    if (editingPlan) {
      await editPlan(editingPlan.id, formData); 
      console.log("Plan editado con éxito");
    } else {
      await submitPlan(formData); 
      toast.success("Plan creado exitosamente");
    }

    setActiveForm(null); //cerramos el formulario en cualquiera de los dos casos de crear o editar 
    setEditingPlan(null); //limpiamos despues de editar o crear un plan

    } catch (error) {
      console.error("#Error al crear el plan", error);
      toast.error("Error al crear el plan");
    }
  };

  //Funcion para cerrar el formulario
  const handleCancelForm = () => {
    setActiveForm(null); 
    setEditingPlan(null); //limpiamos de nuevo el formulario 
  };


  const handleEditPlan = ()  => {
    if (selectedRows.length === 1) {
      const idSeleccionado = selectedRows[0]; //taremos solo el id para solo traer la data de ese plan seleccionado
      const planCompleto = plans.find(plan => plan.id === idSeleccionado);

      if (planCompleto) {
      setEditingPlan(planCompleto); // Establece el plan seleccionado para editar
      setActiveForm("Plan"); // Mostrar el formulario cuando se hace clic en "Plan"
      }
      console.log("Plan seleccionado para editar:", planCompleto);
      setActiveForm("Plan"); // Mostrar el formulario cuando se hace clic en "Plan"
    } else {
      toast.error("Por favor selecciona un solo plan para editar");
    }
  };

  const handelDeletePlan = async () => {
    try {
      if (selectedRows.length === 0){
        toast.error("Por favor selecciona por lo menos un plan para eliminar");
        return;
      }
        await Promise.all(
        selectedRows.map(async (id) => {
          await deletePlan(id);
        })
      );
    } catch (error) {
      console.error("Error al eliminar el plan", error);
      toast.error("Error al eliminar los planes seleccionados");
    }
  };

  const todosLosIDs = plans.map(plan => plan.id);

  console.log("Estructura de carga: ",todosLosIDs)
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
        data={plans}
        onSelectionChange={handleSelectionChange}
        selectable={true}
        columns={columns}
      />

        {activeForm === "Plan" && (
          <UserForm
            title={editingPlan ? "Editar Plan" : "Crear Nuevo Plan"}
            fields = {[
                { 
                name: "nombre_plan",
                label: "Nombre del Plan",
                placeholder: "Nombre", 
                type: "text", 
                required: true 
              },
              { 
                name: "id_tipo_vehiculo",
                label: "Tipo de Vehículo",
                type: "select",

                options: vehicles.map(v => ({ //mapeamos los vehiculos para q muestre el nombre y envie el id como valor
                  value: v.id,
                  label: v.nombre_vehiculo
                })),

                placeholder: "Seleccionar",
                required: true
              },
              { 
                name: "cuestionario",
                type: "select",
                label: "Cuestionario",
                options: [
                  {value: 1, label: "Avaluo Comercial"}, //valores estaticos cambiar mas adelante 
                  {value: 2, label: "Inspección"},
                  {value: 3, label: "Adicionales"}
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
              },
              {
                name: "lista_adicionales",
                type: "hidden", // para no mostrarlo en el formulario
                defaultValue: [], // se envia vacio como array para añadir mas cuando toque editar
              }
            ]}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            initialValues={editingPlan} // En caso de editar, pasamos los valores iniciales
          />
        )}

    </div>
  );
}

export default Administrar;