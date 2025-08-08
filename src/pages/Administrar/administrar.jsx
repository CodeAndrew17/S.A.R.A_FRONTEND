import { useState } from "react";
import Sidebar from "../../components/layout/sidebar"; 
import styled from "styled-components";
import Table from "../../components/tables/table";
import { useColumnsManage } from "./columnsAdmin";
import Toolbar from "../../components/layout/toolbar";
import UserForm from "../../components/modals/userForm";
import usePlansandVehicles from "./adminManager";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import getOrderRegister from "../../utils/getLastRegister";



const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px 20px 20px; /* Más espacio arriba */
  text-align: center;
  margin-top: 10px;
  height: auto; 
`;


const TitleText = styled.h1`
  color: #000;
  font-size: 32px;
  line-height: 1.2; 
  margin: 0;
`;

function Administrar() {
  // Estados
  const [activeForm, setActiveForm] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Hooks personalizados
  const { columns } = useColumnsManage();
  const { plans, vehicles, submitPlan, deletePlan, editPlan } = usePlansandVehicles();

  // Handlers
  const handleSelectionChange = (selectedRows) => {
    console.log("Selected rows:", selectedRows); // Para depuración
    setSelectedRows(prev => {
      console.log("Previous state:", prev); // Para depuración
      return selectedRows;
    });
  };

  const handleCrearPlan = () => {
    setEditingPlan(null);
    setActiveForm("create");
  };

  const handleEditPlan = () => {
  if (selectedRows.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Ningún plan seleccionado',
      text: 'Por favor selecciona un plan para editar',
    });
  } else if (selectedRows.length > 1) {
    Swal.fire({
      icon: 'warning',
      title: 'Demasiados planes seleccionados',
      text: 'Solo puedes editar un plan a la vez',
    });
  } else {
    const planToEdit = plans.find(plan => plan.id === selectedRows[0]);
    setEditingPlan(planToEdit);
    setActiveForm("edit");
  }
  };

  const handleCreateSubmit = async (formData) => {
    try {
      await submitPlan({
        ...formData,
        lista_adicionales: [] // Array vacío para creación
      });
      toast.success("Plan creado exitosamente");
      setActiveForm(null);
    } catch (error) {
      console.error("Error al crear el plan", error);
      toast.error("Error al crear el plan");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await editPlan(editingPlan.id, formData); // PATCH sin lista_adicionales
      toast.success("Plan actualizado con éxito");
      setActiveForm(null);
      setEditingPlan(null);
    } catch (error) {
      console.error("Error al editar el plan", error);
      toast.error("Error al editar el plan");
    }
  };

  const handleCancelForm = () => {
    setActiveForm(null);
    setEditingPlan(null);
    // setSelectedRows([]);  // <-- Esto es lo que causa el problema
  };

  const handelDeletePlan = async () => {
  if (selectedRows.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Ningún plan seleccionado',
      text: 'Selecciona al menos un plan para eliminar',
    });
    return;
  }

  try {
    await deletePlan(selectedRows);
    toast.success("Planes eliminados correctamente");
    //setSelectedRows([]);
  } catch (error) {
    console.error("Error al eliminar planes", error);
    toast.error("Error al eliminar planes");
  }
};


  // Filtrado
  const normalizeText = (text) =>
    text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredPlans = plans.filter((plan) => {
    const search = normalizeText(searchText);
    const matchesSearch =
      normalizeText(plan.nombre_plan).includes(search) ||
      normalizeText(plan.nombre_vehiculo).includes(search) ||
      normalizeText(plan.nombre_cuestionario).includes(search);

    const estadoNormalizado = plan.estado?.toLowerCase();
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "activo" && estadoNormalizado === "ac") ||
      (statusFilter === "inactivo" && estadoNormalizado === "in");

    return matchesSearch && matchesStatus;
  });

  const orderData = getOrderRegister({data: filteredPlans})

  // Render
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
          onSearch={(text) => setSearchText(text)}  
        />
        <Toolbar.Dropdown 
          options={{
            "activo": "Activo", 
            "inactivo": "Inactivo",
            "": "Todos"
          }}
          onSelect={(option) => setStatusFilter(option)}
        />
      </Toolbar>

      <Table
        data={orderData}
        onSelectionChange={handleSelectionChange}
        selectable={true}
        columns={columns}
        containerStyle={{ fontSize: '13px' }}
      />

      {/* Formulario de CREACIÓN */}
      {activeForm === "create" && (
        <UserForm
          title="Crear Plan"
          fields={[
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
              options: vehicles.map(v => ({
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
                {value: 1, label: "Avalúo Comercial"},
                {value: 2, label: "Inspección"},
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
          onSubmit={handleCreateSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {/* Formulario de EDICIÓN */}
      {activeForm === "edit" && editingPlan && (
        <UserForm
          title="Editar Plan"
          fields={[
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
              options: vehicles.map(v => ({
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
                {value: 1, label: "Avaluo Comercial"},
                {value: 2, label: "Inspección"},

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
              placeholder: "Estado",
              required: true
            }
          ]}
          onSubmit={handleEditSubmit}
          onCancel={handleCancelForm}
          initialValues={editingPlan}
        />
      )}
    </div>
  );
}

export default Administrar;