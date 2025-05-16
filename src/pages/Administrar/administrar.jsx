import React, { useEffect } from "react";
import Sidebar from "../../components/sidebar"; 
import styled from "styled-components";
import Toolbar from "../../components/toolbar";
import { useState } from "react";
import Table from "../../components/table"
import { getPlans, getVehicles } from "../../api/api_Admin";


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
  const[loading, setLoading] = useState(true);
  const[loadingPlans, setLoadingPlans] = useState(false);//Estado para carga de planes

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setLoadingPlans(true);

        //Carga de planes y vehiculos
        const [planes, vehiculos] = await Promise.all([
          getPlans(),
          getVehicles()
        ]);

        //Relacion entre Planes y Tipo de vehiculo
        const VehiculoConPlan = vehiculos.map(vehiculo => {
          const plan = planes.find(c => c.id === vehiculo.id_plan);
          return {
            ...vehiculo,
            plan: plan?.nombre || "Sin plan"
          };
        });

        //actualizar estados

        //guardar los vehiculos filtrados


      } catch (error) {
          console.error("Error cargando los datos: ", error);
      } finally{
          setLoading(false);
          setLoadingPlans(false);
          }
      };
      fetchAllData();
    }, [])

  return (
    <div> 
      <Sidebar />
      <TitleWrapper>
        <TitleText>Administrar</TitleText>
      </TitleWrapper>

      <Toolbar
        onCreate={null}
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
            "activo" : "Activo",
            "inactivo" : "Inativo",
            "": "Todos"
          }}  
        />
      </Toolbar>
      <Table/>
    </div>
  );
}

export default Administrar;
