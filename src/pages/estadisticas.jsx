import React from "react";
import Sidebar from "../components/sidebar"; 
import styled from "styled-components";
import CustomButton from "../components/button"; // Asegúrate de que la ruta sea correcta
import { AppWindow, Square } from "lucide-react"; // Asegúrate de que la ruta sea correcta

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


function Estadisticas() {

  const onDelete = () => {
    console.log("eliminar clickeado");
  };

  return (
    <div > 
      <Sidebar />
      <TitleWrapper>
        <TitleText>Estadísticas</TitleText>
      </TitleWrapper>

    </div>
  );
}

export default Estadisticas;
