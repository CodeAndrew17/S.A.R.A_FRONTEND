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
import columnsBranch from "./TableBranches/columnsBranches"; // columnas de las sucursales
import Toolbar from "../../components/Toolbar";
import CustomButton from "../../components/button";

import {handleSucursalSubmit, handleDeleteBranches, handleUpdateBranches} from "./TableBranches/sucursalManagement"; //funciones tipo crud de sucursales

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


const Sucursales = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null); // Estado para editar sucursales
  const [convenios, setConvenios] = useState([]); // Sucursales
  const [conveniosOptions, setConveniosOptions] = useState([]); // Opciones para el dropdown
  const [loading, setLoading] = useState(true);
  const [loadingConvenios, setLoadingConvenios] = useState(false); // Estado de carga específico para convenios

  const [activeCon, setActiveCon] = useState(null);
  const [selectedConvenios, setSelectedConvenios] = useState([]);
  const [sucursalesConvenios, setSucursalesConvenios] = useState([]);
  const [filteredSucursales, setFilteredSucursales] = useState([]); //estado para el filtro de las sucursales filtradas 
  const [searchInput, setSearchInput] = useState("");

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
          const convenio = convenios.find(c => c.id === sucursal.id_convenio);
          return {
            ...sucursal,
            convenio: convenio?.nombre || "Sin convenio" // si no tiene convenio muestra q no tiene
          };
        });
  
        // actualizamos todos los estados 
        setSucursalesConvenios(sucursalesConNombreConvenio);
        setFilteredSucursales(sucursalesConNombreConvenio); //guardamos las sucursales filtradas
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

  const handleSelectionChange = (selectedIds) => {
    setSelectedConvenios(selectedIds);
  };

  const handleCrearSucursal = () => {
    setEditingBranch(null); // Limpiar el estado de edición al crear una nueva sucursal
    setActiveForm("sucursal"); // Mostrar el formulario cuando se hace clic en "Crear Nuevo"
  };

  const handleFormSubmit = async (newData) => {
    try {
      setLoading(true);
      
      if (editingBranch) {
        await handleUpdateBranches(editingBranch.id, newData);
      } else {
        await handleSucursalSubmit(newData);
      }

      // Refetch data after operation
      const [sucursales, convenios] = await Promise.all([
        getBranches(),
        getAgreement()
      ]);

      const sucursalesConNombreConvenio = sucursales.map(sucursal => {
        const convenio = convenios.find(c => c.id === sucursal.id_convenio);
        return {
          ...sucursal,
          convenio: convenio?.nombre || "Sin convenio"
        };
      });

      setSucursalesConvenios(sucursalesConNombreConvenio);
      setFilteredSucursales(sucursalesConNombreConvenio);
      setConveniosOptions(convenios);
      setActiveForm(null);
      setEditingBranch(null);
    } catch (error) {
      console.error("Error al procesar la sucursal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setActiveForm(null);
    setEditingBranch(null);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const result = await handleDeleteBranches(selectedConvenios);
      
      if (result.success) {
        const sucursales = await getBranches();
        const sucursalesConNombreConvenio = sucursales.map(sucursal => {
          const convenio = conveniosOptions.find(c => c.id === sucursal.id_convenio);
          return {
            ...sucursal,
            convenio: convenio?.nombre || "Sin convenio"
          };
        });
        
        setSucursalesConvenios(sucursalesConNombreConvenio);
        setFilteredSucursales(sucursalesConNombreConvenio);
        setSelectedConvenios([]);
      }
    } catch (error) {
      console.error("Error eliminando sucursales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlegestorCon = () => {
    setActiveCon(true);
  };

  const handleGestionCancelar = () => {
    setActiveCon(false);
  };

  const handleSearch = (search) => {
    setSearchInput(search);
  
    if (!search.trim()) {
      setFilteredSucursales(sucursalesConvenios);
      return;
    }
  
    const sanitizedSearch = search.trim().toLowerCase();
  
    const filtered = sucursalesConvenios.filter((sucursal) => {
      const ciudadMatch = sucursal.ciudad?.toLowerCase().includes(sanitizedSearch);
      const nombreMatch = sucursal.nombre?.toLowerCase().includes(sanitizedSearch);
      const direccionMatch = sucursal.direccion?.toLowerCase().includes(sanitizedSearch);
      const convenioMatch = sucursal.convenio?.toLowerCase().includes(sanitizedSearch);

      const estadoTexto = sucursal.estado === "AC" ? "activo" :
                        sucursal.estado === "IN" ? "inactivo" : "";
      const estadoMatch = estadoTexto.includes(sanitizedSearch);
  
      return ciudadMatch || nombreMatch || direccionMatch || convenioMatch || estadoMatch;
    });
  
    setFilteredSucursales(filtered);
  };

  const dataToShow = searchInput.trim() ? filteredSucursales : sucursalesConvenios;

  return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Panel de Sucursales</TitleText>
      </TitleWrapper>

      <Toolbar
        onCreate={handleCrearSucursal}
        onEdit={handlegestorCon}
        onDelete={handleDelete}
        buttonsGap="40px"
        editLabel="Gestionar Convenios"
        onActiveButton={true}
      >
        <Toolbar.Search 
          placeholder="Buscar..." 
          onSearch={handleSearch} 
        />
        <Toolbar.Dropdown 
          options={{
            "activo": "Activo", 
            "inactivo": "Inactivo",
            "": "Todos"
          }}
          onSelect={(option) => {
            if (option === "") {
              setFilteredSucursales(sucursalesConvenios);
            } else {
              const filtered = sucursalesConvenios.filter(
                sucursal => sucursal.estado === (option === "activo" ? "AC" : "IN")
              );
              setFilteredSucursales(filtered);
            }
          }}
        />
      </Toolbar>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando convenios...
        </div>
      ) : (
          <Table
            containerStyle={{fontSize: "13px"}}
            data={dataToShow}
            columns={columnsBranch({ setEditingBranch, setActiveForm })}
            selectable={true}
            onSelectionChange={handleSelectionChange}
          />
      )}

      {activeForm === "sucursal" && (
          <UserForm
            title={editingBranch ? "Editar Sucursal" : "Crear Nueva Sucursal"}
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
            ]}
            initialValues={editingBranch}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
      )}

      {activeCon && (
        <GestionConvenios
          onCerrar={handleGestionCancelar}
        />
      )}

    </div>
  );
};

export default Sucursales;