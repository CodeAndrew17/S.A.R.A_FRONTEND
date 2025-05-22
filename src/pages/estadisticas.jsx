import React from "react";
import Sidebar from "../components/sidebar"; 
import styled from "styled-components";
import CustomButton from "../components/button"; // Asegúrate de que la ruta sea correcta
import { AppWindow, Square } from "lucide-react"; // Asegúrate de que la ruta sea correcta
import { useState } from "react";
import UserForm from "../components/userForm";
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

const ContainerTrash = styled.div`
  display: inline-block; /* Mantiene el tamaño del botón */
  margin-left: 5px;
  margin-top: 250px; /* Espaciado del fondo */
`;
const departamentos = [
  { value: "ant", label: "Antioquia" },
  { value: "cund", label: "Cundinamarca" },
];

const municipios = [
  { value: "med", label: "Medellín", departamentoId: "ant" },
  { value: "env", label: "Envigado", departamentoId: "ant" },
  { value: "bog", label: "Bogotá", departamentoId: "cund" },
  { value: "chi", label: "Chía", departamentoId: "cund" },
];

const Estadisticas = () => {
  const [formFields, setFormFields] = useState([
    {
      name: "departamento",
      label: "Departamento",
      type: "select",
      placeholder: "Seleccione un departamento",
      options: departamentos,
      required: true,
    },
    {
      name: "municipio",
      label: "Municipio",
      type: "select",
      placeholder: "Seleccione un municipio",
      options: [], // Se llenará dinámicamente
      allOptions: municipios,
      required: true,
    }
  ]);

  const handleFieldChange = (name, value) => {
    if (name === "departamento") {
      const filteredMunicipios = municipios.filter(
        (m) => m.departamentoId === value
      );

      const updatedFields = formFields.map((field) => {
        if (field.name === "municipio") {
          return {
            ...field,
            options: filteredMunicipios
          };
        }
        return field;
      });

      setFormFields(updatedFields);
    }
  };

  const handleFormSubmit = (data) => {
    console.log("Datos enviados:", data);
  };

  const handleCancel = () => {
    console.log("Formulario cancelado");
  };

  return (
    <UserForm
      title="Formulario dinámico"
      fields={formFields}
      onSubmit={handleFormSubmit}
      onCancel={handleCancel}
      onFieldChange={handleFieldChange}
    />
  );
};


export default Estadisticas;
