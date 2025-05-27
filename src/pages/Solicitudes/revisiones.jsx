import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import styled from "styled-components";
import Table from "../../components/table";
import ColumnsRequest from "./TableRequest/columnsRequest";
import Toolbar from "../../components/toolbar";
import useRequestManage from "./TableRequest/requestManagement";
import UserForm from "../../components/userForm";
import Swal from "sweetalert2";
import DateDropdown from "../../components/DateDropdown";
import CustomButton from "../../components/button";
import { LucideBrush, FilterX } from "lucide-react";


const CustomButtonWrapper = styled.div`
  transform: scale(0.85);
  transform-origin: left center;
  display: inline-block;
  margin-top: -2px;
`;


const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 10px;
  height: 60px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  line-height: 10px;
  margin: 0;
  top: 20px;
  position: relative;
`;

function Revisiones() {
  const [activeForm, setActiveForm] = useState(true);
  const [editinRequest, setEditinRequest] = useState(null);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [filtroFecha, setFiltroFecha] = useState({ fecha: null, modo: "date" });
  const [fechaKey, setFechaKey] = useState(0)
  const [filteredRevisions, setFilteredRevisions] = useState([]);
  

  const {
    originalRequest,
    dataRequest,
    formsData,
    fetchRequest,
    fetchBaseData,
    createRequest,
    editingRequest,
    removeRequest,
    handleFiledChage,
  } = useRequestManage();

  useEffect(() => {
    const init = async () => {
      await fetchBaseData();
      await fetchRequest();
    };
    init();
  }, []);

  useEffect(() => {
    aplicarFiltros(estadoFiltro, searchInput, filtroFecha);
  }, [dataRequest]);

  const aplicarFiltros = (estado, texto, filtroFecha) => {
    let resultados = dataRequest;

    // Filtro por estado
    if (estado) {
      resultados = resultados.filter((solicitud) => {
        const estadoTexto =
          solicitud.estado === "AC"
            ? "activo"
            : solicitud.estado === "CAL"
              ? "cancelado"
              : solicitud.estado === "PRO"
                ? "en progreso"
                : "";
        return estadoTexto.toLowerCase() === estado.toLowerCase();
      });
    }

    // Filtro por texto
    if (texto.trim()) {
      const textoLower = texto.trim().toLowerCase();
      resultados = resultados.filter((solicitud) => {
        const placaMatch = solicitud.placa?.toLowerCase().includes(textoLower);
        const convenioMatch = solicitud.id_convenio?.toLowerCase().includes(textoLower);
        const sucursalMatch = solicitud.id_sucursal?.toLowerCase().includes(textoLower);
        const fechaMatch = solicitud.fecha?.includes(textoLower);

        return placaMatch || convenioMatch || sucursalMatch || fechaMatch;
      });
    }

    // Filtro por fecha (como string)
    if (filtroFecha.fecha) {
      const selectedDate = new Date(filtroFecha.fecha);
      const selectedYear = selectedDate.getFullYear();
      const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const selectedDay = selectedDate.getDate().toString().padStart(2, "0");

      resultados = resultados.filter((solicitud) => {
        const [year, month, day] = solicitud.fecha.split("-");

        if (filtroFecha.modo === "date") {
          return year === selectedYear.toString() && month === selectedMonth && day === selectedDay;
        }

        if (filtroFecha.modo === "month") {
          return year === selectedYear.toString() && month === selectedMonth;
        }

        if (filtroFecha.modo === "year") {
          return year === selectedYear.toString();
        }

        return true;
      });
    }

    setFilteredRevisions(resultados);
  };

  const handledelete = async()=>{removeRequest(selectedRequests)}

  const handleSearch = (search) => {
    setSearchInput(search);
    aplicarFiltros(estadoFiltro, search, filtroFecha);
  };

  const handleFilterEstado = (estado) => {
    setEstadoFiltro(estado);
    aplicarFiltros(estado, searchInput, filtroFecha);
  };

  const handleCreateRequest = () => {setActiveForm("request");};

  const handleeditRequest = () => {
    if (selectedRequests.length === 1) {
      const selected = selectedRequests[0];
      setEditinRequest(selected);
      
      setActiveForm("request");
    } else {
      Swal.fire({
        title: "Error",
        text: "No se pudo modificar la solicitud. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };




  const handlecCancelForm = ()=>{
    setActiveForm(null)
  }

  const handleFormSubmit = (data) => {
    console.log("Datos recibidos:", data); // <-- Añade esto

    if(editinRequest){
      const dataWithId = {
      ...data,
      id: editinRequest.id
      };
      console.log("ingresar al edit ",dataWithId)
      
      editingRequest(dataWithId)

    }else{
      createRequest(data);
    }
    setActiveForm(null)
    setEditinRequest(null)
    
  };
    return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Revisiones</TitleText>
      </TitleWrapper>

      <Toolbar
        onCreate={handleCreateRequest}
        onEdit={handleeditRequest}
        onDelete={handledelete}
        >

        <Toolbar.Search
          placeholder="Buscar..."
          onSearch={handleSearch} />
        <Toolbar.Dropdown
          options={{
            "activo": "Activo",
            "cancelado": "Cancelado",
            "en progreso": "En progreso",
            "": "Todos"
          }}
          onSelect={handleFilterEstado}
        />
        <DateDropdown
        key={fechaKey}
          onSelect={(fecha, modo) => {
            setFiltroFecha({ fecha, modo });
            aplicarFiltros(estadoFiltro, searchInput, { fecha, modo });
          }}
        />
        <CustomButtonWrapper>
        <CustomButton
          bgColor="#7C9BAF"
          hoverColor="#5D7E93"
          width="130px"
          height="44px"
          onClick={() => {
            setFechaKey(prev => prev + 1);
            setFiltroFecha({ fecha: null, modo: "date" });
            aplicarFiltros(estadoFiltro, searchInput, { fecha: null, modo: "date" });
          }}
          style={null}
          className="Boton extra"
          icon={FilterX}
        >
          Limpiar Fecha
        </CustomButton>
        </CustomButtonWrapper>
      </Toolbar>

      <Table
        columns={ColumnsRequest({})}
        data={filteredRevisions}
        selectable={true}
        onSelectionChange={(selectedIds) => {
          const selectedItems = originalRequest.filter((item) =>
            selectedIds.includes(item.id)
          );
          setSelectedRequests(selectedItems);
          setEditinRequest(selectedItems.length === 1 ? selectedItems[0] : null);
        }}

      />

      {activeForm === "request" && (
        <UserForm
          title="Prueba de Creación"
          fields={formsData}
          onFieldChange={handleFiledChage}
          onCancel={handlecCancelForm}
          onSubmit={handleFormSubmit}
          initialValues={editinRequest || {}}
        />
    
        )}

    </div>
  );
}

export default Revisiones;