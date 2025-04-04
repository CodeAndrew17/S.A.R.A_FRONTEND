import styled from "styled-components";

export const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 10px; /* Espaciado del fondo */
  height: 60px;
`;

export const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  line-height: 10px;
  margin: 0; /* Para que no interfiera con el diseño */
  position: relative;
  top: 20px; /* Ajusta el texto sin afectar el fondo */
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
  margin-left: 50px;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 90%;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
`;

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

//styles de la tabla
export const TableContainer = styled.div`
  width: calc(100% - 80px); /* Ocupa todo el ancho menos el espacio del sidebar */
  margin: 20px 0 20px 80px; /* Margen izquierdo para el sidebar */
  overflow: hidden;
`;

export const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Ajusta los anchos de las columnas para que se distribuyan adecuadamente
export const TableHeader = styled.th`
  background-color: #5FB8D6;
  color: white;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-size: 13px;
  /* Define anchos específicos para cada columna */
  &:nth-child(1) { width: 17%; }   /* Checkbox */
  &:nth-child(2) { width: 15%; }  /* Nombres */
  &:nth-child(3) { width: 15%; }  /* Apellidos */
  &:nth-child(4) { width: 15%; }  /* Cédula */
  &:nth-child(5) { width: 25%; }  /* Correo */
  &:nth-child(6) { width: 15%; }  /* Estado */
  &:nth-child(7) { width: 15%; }  /* Sucursal */
  &:nth-child(8) { width: 15%; }  /* Usuario */
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CheckboxCell = styled.td`
  text-align: center;`;

