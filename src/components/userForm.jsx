import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { validateCreateUserForm } from "../utils/validaciones";
import Swal from "sweetalert2";


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
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Asegura que el padding no rompa el diseño */
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 180px;
  margin-top: 20px;
  width: 100%;
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

const UserForm = ({ title = "Formulario", fields = [], onSubmit, onCancel, successMessage = "Usuario creado con éxito", successDescription = "El usuario ha sido registrado correctamente" }) => {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue !== undefined ? field.defaultValue : "";
    });
    return initialData;
  });

  const [errors, setErrors] = useState({}); //estado para los errores

  // Sincronizar con cambios en defaultValue
  useEffect(() => {
    setFormData(prev => {
      const updatedData = { ...prev };
      let hasChanges = false;

      fields.forEach((field) => {
        if (field.defaultValue !== undefined &&
          prev[field.name] !== field.defaultValue) {
          updatedData[field.name] = field.defaultValue;
          hasChanges = true;
        }
      });

      return hasChanges ? updatedData : prev;
    });
  }, [fields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCreateUserForm(formData, fields);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData); // Ejecuta directamente la función onSubmit
    }
  };

  return (
    <ModalContainer>
      <FormContainer>
        <h1>{title}</h1>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              {field.type === "select" ? (
                <>
                  <Select
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleInputChange}
                    required={field.required}
                    style={{ borderColor: errors[field.name] ? "red" : "black" }}
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
                  {errors[field.name] && <p style={{ color: "red", fontSize: "12px" }}>{errors[field.name]}</p>}
                </>
              ) : field.type === "custom" ? (
                <>
                  <label style={{ marginTop: "10px", fontWeight: "bold" }}>{field.placeholder}</label>
                  {field.component}
                  {errors[field.name] && <p style={{ color: "red", fontSize: "12px" }}>{errors[field.name]}</p>}
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
                    style={{ borderColor: errors[field.name] ? "red" : "black" }}
                  />
                  {errors[field.name] && <p style={{ color: "red", fontSize: "12px" }}>{errors[field.name]}</p>}
                </>
              )}

            </div>
          ))}
          <ButtonContainer>
            <CancelButton type="button" onClick={onCancel}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit">Confirmar</SubmitButton>
          </ButtonContainer>
        </form>
      </FormContainer >
    </ModalContainer >
  );
};

export default UserForm;
