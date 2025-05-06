import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar"
import styled from "styled-components";
import Dropdown from "../../components/Dropdown";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/button";
import UserForm from "../../components/userForm"; 
import { Trash, Filter, Plus, Edit, Settings, Building, Map} from "lucide-react";
import Table from "../../components/table";
import {getBranches, getAgreement} from "../../api/api_Convenios"; 
import columnsAgreement from "./TableAgreement/columnsAgreement"; // columnas de los convenios
import columnsBranches from "./TableBranches/columnsBranches"; // columnas de las sucursales
import Toolbar from "../../components/Toolbar";
import CustomButton from "../../components/button";

import {handleSucursalSubmit, handleDeleteBranches} from "./TableBranches/sucursalManagement"; //funciones tipo crud de sucursales

//!importaciones de gestor de Convenios 
import GestionConvenios from "./convenios";

const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  height: 70px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  margin: 0;
  position: relative;
  top: 10px;  
`;



const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  border: 3px solid #07f53d;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Sucursales = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [convenios, setConvenios] = useState([]); // Sucursales
  const [conveniosOptions, setConveniosOptions] = useState([]); // Opciones para el dropdown
  const [loading, setLoading] = useState(true);
  const [loadingConvenios, setLoadingConvenios] = useState(false); // Estado de carga específico para convenios

  const [activeCon, setActiveCon] = useState(null);
  const [selectedConvenios, setSelectedConvenios] = useState([]);
  const [sucursalesConvenios, setSucursalesConvenios] = useState([]);

  //effect para cargar las sucursales relacionadas con sus convenios al renderizar el componente 
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setLoadingConvenios(true);
  
        // carga de sucursales y convenios 
        const [sucursales, convenios] = await Promise.all([
          getBranches(),
          getAgreement()
        ]);
  
        // proceso para relacionar las sucursales con sus convenios para mostrarlos en la tabla
        const sucursalesConNombreConvenio = sucursales.map(sucursal => {
          const convenio = convenios.find(c => c.id === sucursal.convenio);
          return {
            ...sucursal,
            convenio: convenio?.nombre || "Sin convenio" // si no tiene convenio muestra q no tiene
          };
        });
  
        // actualizamos todos los estados 
        setSucursalesConvenios(sucursalesConNombreConvenio);
        setConvenios(sucursalesConNombreConvenio);
        setConveniosOptions(convenios); // usamos los convenios anteriormente cargados para mostrarlos en el dropdown
  
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
        setLoadingConvenios(false);
      }
    };
  
    fetchAllData();
  }, []);

    const handleSelectionChange = (selectedIds) => {  //!Prueba de checbox 
        setSelectedConvenios(selectedIds);
    };

  const handleFiltrar = () => {
    alert("Filtrando datos...");
  };

  const handleCrearConvenio = () => {
    setActiveForm("convenio"); // Mostrar el formulario cuando se hace clic en "Crear Convenio"
  };

  const handleCrearSucursal = () => {
    setActiveForm("sucursal"); // Mostrar el formulario cuando se hace clic en "Crear Nuevo"
  };

  const handleFormSubmit = async (newData) => {
    if (activeForm === "sucursal") {
      try {
        // Crear la nueva sucursal
        await handleSucursalSubmit(newData, setConvenios, setActiveForm, setSucursalesConvenios); // Añadir setSucursalesConvenios
    
        // Traer las sucursales y convenios actualizados
        const sucursales = await getBranches();
        const convenios = await getAgreement();
    
        // Relacionamos las sucursales con sus convenios
        const sucursalesConConvenios = sucursales.map(sucursal => {
          const convenio = convenios.find(c => c.id === sucursal.convenio);
          return {
            ...sucursal,
            convenio: convenio ? convenio.nombre : "Sin convenio" // Relacionamos por nombre
          };
        });
    
        // Actualizamos el estado de las sucursales y los convenios
        setSucursalesConvenios(sucursalesConConvenios);
        setConvenios(convenios); // Si es necesario también actualizar los convenios
      } catch (error) {
        console.error("Error al crear la sucursal:", error);
      }
    }
  };
  
  

  const handleCancelForm = () => {
    setActiveForm(null); // Cierra el formulario sin guardar nada
  };

  const handleDropdownSelect = (option) => {
    console.log("Opción seleccionada:", option); 
  };

  const handleCreate = () => alert("Creando nuevo elemento");
  const handleEdit = () => alert("Editando elemento seleccionado");


  const handleDelete = async () => {
    const result = await handleDeleteBranches(selectedConvenios);

    if (result.succes) {

    }
  };

  const handlegestorCon=()=>{
    setActiveCon(true); // Activar la visualización de la tabla de convenios
  }
  const handleGestionCancelar = () => {
    setActiveCon(false);
  };
  return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Panel de Sucursales</TitleText>
      </TitleWrapper>

{/* Ejemplo de uso del toolbar solo colocan la funcion para cada uno de crear eliminar y editar son los de por default, si nececitan otro lo añaden controlan el gap de cada uno con buttonsGap */}
    <Toolbar
        onCreate={handleCrearSucursal}
        onEdit={handlegestorCon}
        onDelete={handleDelete}
        buttonsGap="40px" //ejemplo de uso
        editLabel="Gestionar Convenios"
        onActiveButton= {true}
        >
        <Toolbar.Search placeholder="Buscar..." 
        //onSearch={handleSearch} prop para recibir la funcion a ejecutar del search tambien pueden manejar el width
        />
        <Toolbar.Dropdown 
          options={["Todos", "Activos"]} // manjean las choices desde aca 
          onSelect={(opt) => console.log(opt)} // funcion a ajecutar dependiendo del select
        />

      </Toolbar>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando convenios...
        </div>
      ) : (
      <div style={{ fontSize: "13px" }}>
        <Table
          data={sucursalesConvenios}
          columns={columnsBranches}
          selectable={true}
          onSelectionChange={handleSelectionChange} //! Aquie envia los Datos selecionados 
        
        />
      </div>
      )}

      {activeForm === "sucursal" && (
        <FormContainer>
          <UserForm
            title="Crear Nueva Sucursal"
            fields={[
              { name: "nombre", placeholder: "Nombre", type: "text" },
              { name: "ciudad", placeholder: "Ciudad", type: "text" },
              { name: "direccion", placeholder: "Dirección", type: "text" },
              { name: "telefono", placeholder: "Teléfono", type: "tel" },
              { 
                name: "estado",
                type: "select",
                options: [
                {value: "AC", label:"Activo"},
                {value: "IN", label:"Inactivo"}
                ],
                defaultValue: "AC",
                placeholder: "Estado",
              },
              { 
                name: "convenio",
                type: "select",
                options: conveniosOptions.map((c) => ({value: c.id, label: c.nombre})),
                placeholder: loadingConvenios ? "Cargando..." : "Seleccione Convenio",
                disabled: loadingConvenios
              }
            ]
          }
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </FormContainer>
      )}
        {activeCon && (  

          <GestionConvenios
          onCerrar={handleGestionCancelar}
          />
        )}
        <center><Button onClick={() => { //! prueba De Funcionacion de traer datos 
            const datosSeleccionados = convenios.filter(c => selectedConvenios.includes(c.id));
            console.log("Datos seleccionados:", datosSeleccionados);
          }}>
            Imprimir seleccionados
        </Button></center>
    </div>
    
  );
};


export default Sucursales;