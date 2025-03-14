import React, { useState } from "react";
import styled from "styled-components";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Oscurece el fondo */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  padding: 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 800px; /* Ajusta según el tamaño que desees */
  height: auto; /* Se adapta al contenido */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


const Input = styled.input`
  width: 50%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 15px;
  background-color:rgb(95, 200, 214);
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5fa6c7;
  }
`;

const CancelButton = styled.button`
  padding: 10px 15px;
  background-color: #a9a9a9;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #8b8b8b;
  }
`;

const UserForm = ({ title = "Formulario", fields = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <ModalContainer>
    <FormContainer>
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <Input
            key={field.name}
            type={field.type || "text"} 
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
          />
        ))}
        <ButtonContainer>
          <CancelButton type="button" onClick={onCancel}>
            Cancelar
          </CancelButton>
          <SubmitButton type="submit">Confirmar</SubmitButton>
        </ButtonContainer>
      </form>
    </FormContainer>
    </ModalContainer>
  );
};

export default UserForm;
