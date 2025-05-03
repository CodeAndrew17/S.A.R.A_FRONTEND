import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar"
import styled from "styled-components";
import Dropdown from "../../components/Dropdown";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/button";
import UserForm from "../../components/userForm"; 
import { Trash, Filter, Plus, Edit, Settings, Building, Map} from "lucide-react";
import Table from "../../components/table";
import {getSucursales} from "../../api/api_Convenios"; 
import columnsAgreement from "./TableAgreement/columnsAgreement"; // columnas de los convenios
import columnsBranches from "./TableBranches/columnsBranches"; // columnas de las sucursales
import Toolbar from "../../components/Toolbar";
import CustomButton from "../../components/button";

//!importaciones de gestor de Convenios 
import GestionConvenios from "./convenios";

const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 5px;
  height: 60px;
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
    border:3px solid #07f53d;

`;





const Sucursales = () => {
  const [activeForm, setActiveForm] = useState(null); // Estado para mostrar/ocultar el formulario
  const [convenios, setConvenios] = useState([]); //estado para los convenios 
  const [loading, setLoading] = useState(true); // estado de la carga de datos 
  const [activeCon, setActiveCon] = useState(null)
  const [selectedConvenios, setSelectedConvenios] = useState([]); //!Prueba de checbox 
        useEffect(() => {
          const fetchConvenios = async () => { 
            try {
              setLoading(true); //inica la carga de datos 
              const data = await getSucursales();
              setConvenios(data)
              setLoading(false); 
            } catch (error) {
              console.error("Error al cargar convenios; ", error);
              setLoading(false);
            }
          };

          fetchConvenios();
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

  const handleFormSubmit = (newUserData) => {
    console.log("Datos capturados:", newUserData);
    setShowForm(false); // Cierra el formulario después de capturar los datos
  };

  const handleCancelForm = () => {
    setActiveForm(null); // Cierra el formulario sin guardar nada
  };

  const handleDropdownSelect = (option) => {
    console.log("Opción seleccionada:", option); 
  };

  const handleCreate = () => alert("Creando nuevo elemento");
  const handleEdit = () => alert("Editando elemento seleccionado");
  const handleDelete = () => alert("Eliminando elemento");

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
        onCreate={handleCrearConvenio}
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
        <Table
          data={convenios}
          columns={columnsBranches}
          selectable={true}
          onSelectionChange={handleSelectionChange} //! Aquie envia los Datos selecionados 
         
        />
      )}

      {activeForm === "sucursal" && (
        <FormContainer>
          <UserForm
            title="Crear Sucursal"
            fields={[
              { name: "name", placeholder: "Nombre", type: "text" },
              { name: "city", placeholder: "Ciudad", type: "text" },
              { name: "address", placeholder: "Dirección", type: "text" },
              { name: "phone", placeholder: "Teléfono", type: "tel" },
              { name: "convenio", placeholder: "Convenio", type: "text" },//esto es una llave foranea el back tiene q pasar las choices
            ]}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </FormContainer>
      )}

      {activeForm === "convenio" && (
        <FormContainer>
          <UserForm
          title="Crear Convenio"
          fields={[ 
            { name: "name", placeholder: "Nombre", type: "text" },
            { name: "nit", placeholder: "NIT", type: "text" },
            { name: "phone", placeholder: "Teléfono", type: "tel" },
            { name: "city", placeholder: "Ciudad", type: "text" },
          ]}

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