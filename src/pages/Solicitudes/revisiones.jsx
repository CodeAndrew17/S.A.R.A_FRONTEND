import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar"; 
import styled from "styled-components";
import Table from "../../components/table";
import ColumnsRequest from "./TableRequest/columnsRequest";
import Toolbar from "../../components/Toolbar";

import { getRequest } from "../../api/api_Solicitudes";


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
  top: 20px; /* Ajusta el texto sin afectar el fondo */
  position: relative;

`;

function Revisiones() {
  const [activeForm, setActiveForm]= useState(true)
  const [loading,setLoading]=useState(true)
  const [dataRequest, setDataRequest]= useState([])

  useEffect(() => {

    const fetchRequest = async () => {

      try {

        setLoading(true);
        const data = await getRequest();
        setDataRequest(data);

      } catch (error) {

        console.error("Error al obtener solicitudes:", error);
      } finally {

        setLoading(false);

      }
    };

  fetchRequest();
  }, []);

  const prueba= dataRequest.id_convenio

  return (
    <div > 
      <Sidebar />
      <TitleWrapper>
        <TitleText>Revisiones</TitleText>
      </TitleWrapper>
      <Toolbar>

        <Toolbar.Search 
          placeholder="Buscar..."
          onSearch={null} 
      
        />
        <Toolbar.Dropdown
          options={{
            "AC": "Activo", 
            "IN": "Inactivo",
            'PE': "En Progreso",
            "": "Todos"}}            
          onSelect={null}
        />

      </Toolbar>

      {console.log("data del table",dataRequest)}
      <Table
      columns={ColumnsRequest({})}
      data={dataRequest}
      selectable={true}
      
      />
    </div>
  );
}


export default Revisiones;










/* 
const barrios = [
  { value: "b1", label: "Barrio 1", zona: "NORTE" },
  { value: "b2", label: "Barrio 2", zona: "SUR" },
  { value: "b3", label: "Barrio 3", zona: "NORTE" },
  { value: "b4", label: "Barrio 4", zona: "CENTRO" },
];
const Revisiones = () => {
  const [formFields, setFormFields] = useState([
    {
      name: "zona",
      label: "Zona",
      type: "text",
      placeholder: "Ingrese una zona (NORTE, SUR, CENTRO)",
      required: true,
    },

    {
      name: "zona",
      label: "Zona",
      type: "text",
      placeholder: "Ingrese una zona (NORTE, SUR, CENTRO)",
      required: true,
    },
    {
      name: "barrio",
      label: "Barrio",
      type: "select",
      placeholder: "Seleccione un barrio",
      options: [],
      allOptions: barrios,
      required: true,
    }
  ]);

  const handleFieldChange = (name, value) => {
    if (name === "zona") {
      const filtered = barrios.filter(b => b.zona === value.toUpperCase());

      const updatedFields = formFields.map((field) => {
        if (field.name === "barrio") {
          return { ...field, options: filtered };
        }
        return field;
      });

      setFormFields(updatedFields);
    }
  };

  return (
    <UserForm
      title="Formulario Zona y Barrio"
      fields={formFields}
      onSubmit={(data) => console.log("Enviado", data)}
      onCancel={() => console.log("Cancelado")}
      onFieldChange={handleFieldChange}
    />
  );
};


export default Revisiones;
*/