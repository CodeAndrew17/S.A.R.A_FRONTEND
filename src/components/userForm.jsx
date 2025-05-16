import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { validateCreateUserForm } from "../utils/validaciones";
import Swal from "sweetalert2";

// Importa tu imagen
import logo from '../assets/images/iconForm.png';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  width: 680px;
  height: auto;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;  /* Más grande */
  height: 50px; /* Más grande */
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding-top: 10px;
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  margin-bottom: 15px;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 10px 0;
`;

const FormContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
  transition: border 0.3s;

  &:focus {
    border-color: rgb(95, 200, 214);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  box-sizing: border-box;
  font-size: 14px;
  transition: border 0.3s;

  &:focus {
    border-color: rgb(95, 200, 214);
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  width: 100%;
  grid-column: 1 / -1;
`;

const SubmitButton = styled.button`
  padding: 12px 25px;
  background-color: rgb(95, 200, 214);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  width: 150px;

  &:hover {
    background-color: #5fa6c7;
  }
`;

const CancelButton = styled.button`
  padding: 12px 25px;
  background-color: #a9a9a9;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  width: 150px;

  &:hover {
    background-color: #8b8b8b;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin: 0;
  padding: 0;
  height: 16px;
`;

const UserForm = ({
  title = "Formulario",
  fields = [],
  onSubmit,
  onCancel,
  successMessage = "Usuario creado con éxito",
  successDescription = "El usuario ha sido registrado correctamente",
  initialValues = {}
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initialData = {};
    fields.forEach((field) => {
      if (initialValues && initialValues[field.name] !== undefined) {
        initialData[field.name] = initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      } else {
        initialData[field.name] = "";
      }
    });
    setFormData(initialData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCreateUserForm(formData, fields);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  return (
    <ModalContainer>
      <FormContainer>
        <LogoContainer>
          <img src={logo} alt="Logo del aplicativo" />
        </LogoContainer>
        
        <FormHeader>
          <Title>{title}</Title>
          <Separator />
        </FormHeader>
        
        <form onSubmit={handleSubmit}>
          <FormContent>
            {fields.map((field) => (
              <InputGroup key={field.name}>
                <label style={{ 
                  marginBottom: "8px", 
                  fontWeight: "500",
                  color: "#555",
                  fontSize: "14px"
                }}>
                  {field.label || field.placeholder}
                  {field.required && <span style={{ color: "red" }}> *</span>}
                </label>
                {field.type === "select" ? (
                  <>
                    <Select
                      name={field.name}
                      value={formData[field.name] ?? ""}
                      onChange={handleInputChange}
                      required={field.required}
                      disabled={field.disabled}
                      style={{ borderColor: errors[field.name] ? "red" : "#ddd" }}
                    >
                      <option value="" disabled>
                        {field.placeholder}
                      </option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <ErrorMessage>{errors[field.name]}</ErrorMessage>
                  </>
                ) : field.type === "custom" ? (
                  <>
                    <label style={{ marginBottom: "8px", fontWeight: "500" }}>
                      {field.placeholder}
                    </label>
                    {field.component}
                    <ErrorMessage>{errors[field.name]}</ErrorMessage>
                  </>
                ) : (
                  <>
                    <Input
                      type={field.type || "text"}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name] ?? ""}
                      onChange={handleInputChange}
                      required={field.required}
                      style={{ borderColor: errors[field.name] ? "red" : "#ddd" }}
                    />
                    <ErrorMessage>{errors[field.name]}</ErrorMessage>
                  </>
                )}
              </InputGroup>
            ))}
          </FormContent>
          
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