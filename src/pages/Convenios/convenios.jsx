import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar"
import styled from "styled-components";
import Dropdown from "../../components/Dropdown";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/button";
import UserForm from "../../components/userForm"; 
import { Trash, Filter, Plus, Edit, Settings, Building, Map} from "lucide-react";
import Table from "../../components/table";
import {getConvenios} from "../../api/api_Convenios"; 
import columns from "./TableAgreement/columns"; 
import Toolbar from "../../components/Toolbar";


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

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: 40px; // Aumenta este valor para mover el SearchBar más a la derecha
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between; // Distribuye el espacio entre los elementos
  align-items: center;
  padding: 10px 20px;
  width: 90%;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 20px; // Esto empuja el contenedor hacia la derecha
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

const ButtonSucursales = styled.div`
  margin-right: -15px; 
`;

const TableContainer = styled.div`
  width: 100%;
  margin: 20px auto 20px 40px; /* ← Márgen izquierdo aumentado */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContainerToolbar = styled.div`
  margin-left: 280px; 
  margin-top: 20px; 
`;

const Convenios = () => {
  const [activeForm, setActiveForm] = useState(null); // Estado para mostrar/ocultar el formulario
  const [convenios, setConvenios] = useState([]); //estado para los convenios 
  const [loading, setLoading] = useState(true); // estado de la carga de datos 

        useEffect(() => {
          const fetchConvenios = async () => { 
            try {
              setLoading(true); //iniica la carga de datos 
              const data = await getConvenios();
              setConvenios(data)
              setLoading(false); 
            } catch (error) {
              console.error("Error al cargar convenios; ", error);
              setLoading(false);
            }
          };

          fetchConvenios();
      }, []);


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

  return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Panel de Convenios</TitleText>
      </TitleWrapper>

{/* Ejemplo de uso del toolbar solo colocan la funcion para cada uno de crear eliminar y editar son los de por default, si nececitan otro lo añaden controlan el gap de cada uno con buttonsGap */}
      <ContainerToolbar>
      <Toolbar
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        buttonsGap="40px" //ejemplo de uso
      >
        <Toolbar.Search placeholder="Buscar..." 
        //onSearch={handleSearch} prop para recibir la funcion a ejecutar del search tambien pueden manejar el width
        />
        <Toolbar.Dropdown 
          options={["Todos", "Activos"]} // manjean las choices desde aca 
          onSelect={(opt) => console.log(opt)} // funcion a ajecutar dependiendo del select
        />
      </Toolbar>
      </ContainerToolbar>

      <div style={{ width: '90%', margin: '0 auto' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando convenios...
        </div>
      ) : (
      <TableContainer>
        <Table
          data={convenios}
          columns={columns}
          onRowClick={(convenio) => {
            console.log('Convenio seleccionado:', convenio);
          }}
        />
        </TableContainer>
      )}
    </div>

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
    </div>
  );
};

export default Convenios;
