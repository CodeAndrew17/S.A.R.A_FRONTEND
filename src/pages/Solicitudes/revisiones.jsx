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
import { useNavigate } from "react-router-dom";
import getOrderRegister from "../../utils/getLastRegister";


const CustomButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -80px;
  padding-right: 40px;
  flex-wrap: wrap;

  @media (max-width: 600px) { 
    margin-top: 0;
    justify-content: center; 
  }

  @media (min-width: 556px) and (max-width: 720px) { 
    margin-top: -20px; /* Lo bajamos un poco más */
    justify-content: center;
  }

  @media (max-width: 520px) { 
    margin-top: -20px; 
    justify-content: center;
  }

  @media (min-width: 1012px) and (max-width: 1320px) {
    margin-top: -30px;
    justify-content: center;
  }
`;


const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px 20px 20px;
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

function Revisiones() {
  const [activeForm, setActiveForm] = useState(null);
  const [editingRequestData, setEditingRequestData] = useState(null);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [filtroFecha, setFiltroFecha] = useState({ fecha: null, modo: "date" });
  const [fechaKey, setFechaKey] = useState(0);
  const [filteredRevisions, setFilteredRevisions] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const {
    originalRequest,
    dataRequest,
    formsData,
    fetchRequest,
    fetchBaseData,
    createRequest,
    editingRequest: editRequestApi, //cambiamos nombre para eviatr confuciones 
    removeRequest,
    handleFiledChage,
  } = useRequestManage();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await fetchBaseData();
        await fetchRequest();
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    aplicarFiltros(estadoFiltro, searchInput, filtroFecha);
  }, [dataRequest, estadoFiltro, searchInput, filtroFecha]);

  const aplicarFiltros = (estado, texto, filtroFecha) => {
    let resultados = dataRequest;

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

    if (texto.trim()) {
      const textoLower = texto.trim().toLowerCase();
      resultados = resultados.filter((solicitud) => {
        const placaMatch = solicitud.placa?.toLowerCase().includes(textoLower);
        const convenioMatch = solicitud.id_convenio?.toLowerCase().includes(textoLower);
        const sucursalMatch = solicitud.id_sucursal?.toLowerCase().includes(textoLower);
        const fechaMatch = solicitud.fecha?.includes(textoLower);
        const planMatch = solicitud.id_plan?.toLowerCase().includes(textoLower);

        return placaMatch || convenioMatch || sucursalMatch || fechaMatch || planMatch;
      });
    }

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


  const handledelete = async () => {
    await removeRequest(selectedRequests);
    setSelectedRequests([]);
  };

  const handleSearch = (search) => {
    setSearchInput(search);
  };

  const handleFilterEstado = (estado) => {
    setEstadoFiltro(estado);
  };

  const handleCreateRequest = () => {
    setEditingRequestData(null);
    setActiveForm("request");
  };

  const handleeditRequest = async () => {
    if (selectedRequests.length === 1) {
      setIsLoading(true);
      try {
        await fetchRequest(); //con esto refrescamos 
        
        const updatedRequest = originalRequest.find( //obtenemos el ultimo elemento para actualizarlo en el form 
          item => item.id === selectedRequests[0].id
        );
        
        setEditingRequestData(updatedRequest || selectedRequests[0]); //usamos los datos mas frescos para evitar problemas de dessincronizacion 
        setActiveForm("request");
      } finally {
        setIsLoading(false);
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Debes seleccionar exactamente una solicitud para editar",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handlecCancelForm = () => {
    setActiveForm(null);
    setEditingRequestData(null); 
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (editingRequestData) {
        const dataWithId = {
          ...data,
          id: editingRequestData.id
        };
        await editRequestApi(dataWithId); //usamos la funcion renombrada 
      } else {
        await createRequest(data);
      }
      
      setActiveForm(null);
      setEditingRequestData(null);
      await fetchRequest(); //frozar actualizacion 
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al procesar la solicitud",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const orderData = getOrderRegister({data: filteredRevisions})

  return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText> Panel de Revisiones</TitleText>
      </TitleWrapper>

      <Toolbar
        onCreate={handleCreateRequest}
        onEdit={handleeditRequest}
        onDelete={handledelete}
      >
        <Toolbar.Search
          placeholder="Buscar..."
          onSearch={handleSearch}
        />
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
            setShowButton(!!fecha);
          }}
        />
      </Toolbar>

      {showButton && (
        <CustomButtonWrapper>
          <CustomButton
            bgColor="#7C9BAF"
            hoverColor="#5D7E93"
            width="110px"
            height="30px"
            onClick={() => {
              setFechaKey(prev => prev + 1);
              setFiltroFecha({ fecha: null, modo: "date" });
              setShowButton(false);
            }}
            style={null}
            className="Boton extra"
            icon={FilterX}
          >
            Limpiar
          </CustomButton>
        </CustomButtonWrapper>
      )}

      <Table
        columns={ColumnsRequest({navigate})}
        data={orderData}
        selectable={true}
        onSelectionChange={(selectedIds) => {
          const selectedItems = originalRequest.filter((item) =>
            selectedIds.includes(item.id)
          );
          setSelectedRequests(selectedItems);
          setEditingRequestData( // actualizar ambos estados al mismo tiempo 
            selectedItems.length === 1 ? selectedItems[0] : null
          );
        }}
      />

      {activeForm === "request" && (
        <UserForm
          title={editingRequestData ? "Editar Solicitud" : "Nueva Solicitud"}
          fields={formsData}
          onFieldChange={handleFiledChage}
          onCancel={handlecCancelForm}
          onSubmit={handleFormSubmit}
          initialValues={editingRequestData || {}}
        />
      )}
    </div>
  );
}

export default Revisiones;