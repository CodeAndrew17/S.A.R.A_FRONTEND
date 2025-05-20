import React, { useEffect } from "react";
import Sidebar from "../../components/sidebar";
import styled from "styled-components";
import Toolbar from "../../components/toolbar";
import { useState } from "react";
import Table from "../../components/table"
import CustomButton from "../../components/button";
import { getPlans, getVehicles } from "../../api/api_Admin";
import { use } from "react";
import { ListTodo } from "lucide-react";
import columnsAdmin from "../Administrar/TableAdmin/columnsAdmin"
import UserForm from "../../components/userForm";
import { handlePaqueteSubmit, handleUpdatePaquetes } from "./TableAdmin/adminManager";



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

const Administrar = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [editingPack, setEditingPack] = useState(null)
  const [planes, setPlanes] = useState(null);
  const [packsOptions, setPacksOptions] = useState([]);
  const [vehiculosOptions, setVehiculosOptions] = useState([]);
  const [formularioOptions, setFormularioOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);//Estado para carga de planes
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingForms, setLoadingForms] = useState(true);

  const [activePack, setActivePack] = useState(null);
  const [selectedPacks, setSelectedPacks] = useState([]);
  const [vehiculosPlanes, setVehiculosPlanes] = useState([]);
  const [filteredPacks, setFilteredPacks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setLoadingPlans(true);
        setLoadingVehicles(true);

        const [planesRes, vehiculosRes] = await Promise.all([
          getPlans(),
          getVehicles()
        ]);

        const VehiculoConPlan = vehiculosRes.map(vehiculo => {
          const plan = planesRes.find(c => c.id === vehiculo.id_plan);
          return {
            ...vehiculo,
            plan: plan?.nombre || "Sin plan"
          };
        });

        // Actualizar todos los estados correctamente
        setPlanes(planesRes);
        setVehiculosPlanes(VehiculoConPlan);
        setFilteredPacks(VehiculoConPlan);
        setPacksOptions(planesRes);
        setVehiculosOptions(vehiculosRes);

      } catch (error) {
        console.error("Error cargando los datos: ", error);
      } finally {
        setLoading(false);
        setLoadingPlans(false);
        setLoadingVehicles(false); // 🔥 Este es el que desbloquea el SELECT
      }
    };

    fetchAllData();
  }, []);


  const handleCrearPaquete = () => {
    setEditingPack(null);
    setActiveForm("Paquete")
  }

  const handleCancelForm = () => {
    setActiveForm(null);
    setEditingPack(null);
  }

  const handleGestionCancelar = () => {
    setActivePack(false);
  };

  const handleFormSubmit = async (newData) => {
    try {
      setLoading(true);

      if (editingPack) {
        await handleUpdatePaquetes(editingPack.id, newData);
      } else {
        await handlePaqueteSubmit(newData);
      }

      const VehiculoConPlan = vehiculos.map(vehiculo => {
        const plan = planes.find(c => c.id === vehiculo.id_plan);
        return {
          ...vehiculo,
          plan: plan?.nombre || "Sin plan"
        };
      });

      //actualizar estados
      setVehiculosPlanes(VehiculoConPlan);
      setFilteredPacks(VehiculoConPlan);
      setPlanes(vehiculosPlanes);
      setPacksOptions(planes); //guardar los planes filtrados


    } catch (error) {
      console.error("Error cargando los datos: ", error);
    } finally {
      setLoading(false);
      setLoadingPlans(false);
    }

  };


  console.log(vehiculosOptions);
  return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Administrar</TitleText>
      </TitleWrapper>

      <Toolbar
        onCreate={handleCrearPaquete}
        onEdit={null}
        onDelete={null}
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
            "inactivo": "Inativo",
            "": "Todos"
          }}
        />

        <CustomButton
          bgColor="#32d0ac"
          hoverColor="#32d0ac"
          width="120px"
          height="40px"
          onClick={() => console.log("Boton clickado")}
          style={null}
          className="Boton extra"
          icon={ListTodo}
        >
          Gestionar items
        </CustomButton>
      </Toolbar>

      {/* Formulario solo para crear */}
      {activeForm === "Paquete" && (
        <UserForm
          title="Crear Nuevo Paquete"
          fields={[
            { name: "nombre_plan", placeholder: "Nombre", type: "text" },
            {
              name: "Vehículo",
              type: "select",
              options: vehiculosOptions.map((v) => ({ value: v.id, label: v.nombre_vehiculo })),
              placeholder: loadingVehicles ? "Cargando..." : "Seleccione Vehículo",
              disabled: loadingVehicles
            },
            {
              name: "Formulario",
              type: "select",
              options: formularioOptions.map((f) => ({ value: f.id, label: f.nombre })),
              placeholder: loadingForms ? "Cargando..." : "Seleccione Formulario",
              disabled: loadingForms
            },
            {
              name: "estado",
              type: "select",
              options: [
                { value: "AC", label: "Activo" },
                { value: "IN", label: "Inactivo" }
              ],
              defaultValue: "AC",
              placeholder: "Estado",
            },
          ]}
          initialValues={{}} // Vacío porque es solo creación
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {activePack && (
        <GestionConvenios
          onCerrar={handleGestionCancelar}
        />
      )}
    </div>
  );
};

export default Administrar;
