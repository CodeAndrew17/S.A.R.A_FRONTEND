import React, { useState, useEffect } from "react";
import styled, {keyframes} from "styled-components";
import { validateCreateUserForm } from "../../utils/validaciones";
import Swal from "sweetalert2";
import logo from "../../assets/images/iconForm.png";

const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;


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
  animation: ${fadeIn} 0.3s ease-out forwards;
  opacity: 0;
`;


const FormContainer = styled.div`
  padding: 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 680px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease-out forwards;
  transform: translateY(50px);
  opacity: 0;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  width: 50px;
  height: 50px;
  
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
  font-size: 24px;
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
  padding-right: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;


const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  grid-column: ${({ $fullWidth }) => $fullWidth ? '1 / -1' : 'auto'};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
  transition: all 0.3s;

  &:focus {
    border-color: rgb(95, 200, 214);
    outline: none;
    box-shadow: 0 0 0 2px rgba(95, 200, 214, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  border: 1px solid #e2e8f0; /* gris clarito */
  border-radius: 6px;
  background-color: #f9fafb; /* gris muy claro */
  box-sizing: border-box;
  font-size: 14px;
  transition: all 0.3s ease;
  appearance: none;
  color: #374151; /* gris oscuro elegante */

  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px auto;

  &:hover {
    border-color: #94a3b8; /* gris azulado */
    background-color: #ffffff;
  }

  &:focus {
    border-color: #3b82f6; /* azul moderno */
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); /* azul suave */
    background-color: #ffffff;
  }
`;


const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s;

  &:focus {
    border-color: rgb(95, 200, 214);
    outline: none;
    box-shadow: 0 0 0 2px rgba(95, 200, 214, 0.2);
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

// Estilos del switch

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 42px; /* mismo alto que los inputs */
  padding: 0 10px;
  margin: 6px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  box-sizing: border-box;
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: rgb(95, 200, 214);
  }

  &:checked + span:before {
    transform: translateX(22px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;



const UserForm = ({
  title = "Formulario",
  fields = [],
  onSubmit,
  onCancel,
  children,
  onFieldChange,
  successMessage = "Usuario creado con éxito",
  successDescription = "El usuario ha sido registrado correctamente",
  initialValues = {},
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

    //errores para los inputs 
  const validationRules = {
    telefono: { regex: /^[0-9]{10}$/, message: "El teléfono debe tener 10 dígitos" },
    cedula: { regex: /^[0-9]{6,12}$/, message: "La cédula debe tener entre 6 y 12 números unicamente" },
    placa: { regex: /^[A-Z]{3}[0-9]{3}$/, message: "La placa debe ser en formato ABC123" },
    nombres: { regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,40}$/, message: "Solo letras, máximo 40 caracteres" },
    apellidos: { regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,40}$/, message: "Solo letras, máximo 40 caracteres" },
  };


  //funcion para validar y devolver los erroes correctos 
  const validateField = (name, value) => {
  const rule = validationRules[name];
  if (rule && !rule.regex.test(value)) {
    return rule.message; // devuelve error
  }
  return ""; // sin error
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    //validamos errores 
    const errorMsg = validateField(name,value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg}));

    if (typeof onFieldChange === 'function') {
      onFieldChange(name, value);
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

  const renderSelectField = (field) => (
    <InputGroup $fullWidth={field.fullWidth}>
      <label style={{ 
        marginBottom: "8px", 
        fontWeight: "500",
        color: "#555",
        fontSize: "14px"
      }}>
        {field.label || field.placeholder}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </label>
      <Select
        name={field.name}
        value={formData[field.name] ?? ""}
        onChange={handleInputChange}
        required={field.required}
        disabled={field.disabled}
        style={{ borderColor: errors[field.name] ? "red" : "#ddd" }}
      >
        <option value="" style={{ color: '#999' }}>
          {field.placeholder || "Seleccione una opción"}
        </option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <ErrorMessage>{errors[field.name]}</ErrorMessage>
    </InputGroup>
  );

  const renderInputField = (field) => {
  const isNumericField = field.name === "cedula" || field.name === "telefono";
  const isAlphaField = ["nombre", "nombre_plan", "nombres", "apellidos"].includes(field.name);
  const isPlacaField = field.name === "placa";

  // helper para actualizar formData + callback externo
  const updateValue = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (typeof onFieldChange === "function") onFieldChange(name, value);
  };

  // solo numeros para campo numerico (filtra y muestra error si intentan meter otra cosa)
  const handleNumericChange = (e) => {
    const raw = e.target.value;
    const onlyNumbers = raw.replace(/[^0-9]/g, "");
    if (raw !== onlyNumbers) {
      setErrors(prev => ({ ...prev, [field.name]: "Solo se permiten números" }));
    } else {
      setErrors(prev => ({ ...prev, [field.name]: "" }));
    }
    updateValue(field.name, onlyNumbers);
  };

  // solo letras y espacios (filtra y muestra error si intentan meter otra cosa)
  const handleAlphaChange = (e) => {
    const raw = e.target.value;
    const onlyLetters = raw.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    if (raw !== onlyLetters) {
      setErrors(prev => ({ ...prev, [field.name]: "Solo se permiten letras" }));
    } else {
      setErrors(prev => ({ ...prev, [field.name]: "" }));
    }
    updateValue(field.name, onlyLetters);
  };

  // placa: mayúsculas, solo letras/números, max 6
  const handlePlacaChange = (e) => {
  const raw = e.target.value;
  let valid = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (valid.length > 6) valid = valid.slice(0, 6);

  if (raw.toUpperCase() !== valid) {
    setErrors(prev => ({ ...prev, [field.name]: "Solo letras y números (máx. 6 caracteres)" }));
  } else if (valid.length < 6 && valid.length > 0) {
    setErrors(prev => ({ ...prev, [field.name]: "La placa debe tener 6 caracteres" }));
  } else {
    setErrors(prev => ({ ...prev, [field.name]: "" }));
  }

  updateValue(field.name, valid);
};

  return (
    <InputGroup $fullWidth={field.fullWidth}>
      <label style={{ marginBottom: "8px", fontWeight: "500", color: "#555", fontSize: "14px" }}>
        {field.label || field.placeholder}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </label>
      <Input
        type="text"
        name={field.name}
        placeholder={field.placeholder}
        value={formData[field.name] ?? ""}
        onChange={
          isNumericField
            ? handleNumericChange
            : isAlphaField
            ? handleAlphaChange
            : isPlacaField
            ? handlePlacaChange
            : (e) => updateValue(field.name, e.target.value)
        }
        required={field.required}
        inputMode={isNumericField ? "numeric" : "text"}
        pattern={
          isNumericField
            ? "[0-9]*"
            : isAlphaField
            ? "[A-Za-zÁÉÍÓÚáéíóúÑñ ]*"
            : isPlacaField
            ? "^[A-Z]{3}[0-9]{3}$"
            : undefined
        }
        maxLength={
          isPlacaField ? 6 :
          field.name === "telefono" ? 10 :
          field.name === "cedula" ? 12 :
          isAlphaField ? 40 :
          field.maxLength ?? undefined
        }
        style={{ borderColor: errors[field.name] ? "red" : "#ddd" }}
      />
      <ErrorMessage>{errors[field.name]}</ErrorMessage>
    </InputGroup>
  );
};



  const renderTextAreaField = (field) => (
    <InputGroup $fullWidth={field.fullWidth}>
      <label style={{ 
        marginBottom: "8px", 
        fontWeight: "500",
        color: "#555",
        fontSize: "14px"
      }}>
        {field.label || field.placeholder}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </label>
      <TextArea
        name={field.name}
        placeholder={field.placeholder}
        value={formData[field.name] ?? ""}
        onChange={handleInputChange}
        required={field.required}
        style={{ borderColor: errors[field.name] ? "red" : "#ddd" }}
      />
      <ErrorMessage>{errors[field.name]}</ErrorMessage>
    </InputGroup>
  );

  const renderSwitchField = (field) => (
  <InputGroup $fullWidth={field.fullWidth}>
    <label
      style={{
        marginBottom: "8px",
        fontWeight: "500",
        color: "#555",
        fontSize: "14px",
      }}
    >
      {field.label}
      {field.required && <span style={{ color: "red" }}> *</span>}
    </label>

    <SwitchWrapper>
      <SwitchLabel>
        <SwitchInput
          type="checkbox"
          name={field.name}
          checked={formData[field.name] === "AC"}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: field.name,
                value: e.target.checked ? "AC" : "IN", // logica de activo e inactivo 
              },
            })
          }
        />
        <SwitchSlider />
      </SwitchLabel>

      <span
        style={{
          marginLeft: "10px",
          fontSize: "14px",
          color: formData[field.name] === "AC" ? "green" : "red",
          fontWeight: "500",
        }}
      >
        {formData[field.name] === "AC" ? "Activado" : "Desactivado"}
      </span>
    </SwitchWrapper>

    <ErrorMessage>{errors[field.name]}</ErrorMessage>
  </InputGroup>
);


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
            {fields.map((field, index) => {
              if (field.type === "select") {
                return (
                  <InputGroup $fullWidth={field.fullWidth} key={field.name || index}>
                    {renderSelectField(field)}
                  </InputGroup>
                );
              } else if (field.type === "textarea") {
                return (
                  <InputGroup $fullWidth={field.fullWidth} key={field.name || index}>
                    {renderTextAreaField(field)}
                  </InputGroup>
                );
              } else if (field.type === "switch") {   // agregamos el tipo creado switch
                return (
                  <InputGroup $fullWidth={field.fullWidth} key={field.name || index}>
                    {renderSwitchField(field)}
                  </InputGroup>
                );
              } else if (field.type === "custom") {
                return (
                  <InputGroup $fullWidth={field.fullWidth} key={field.name || index}>
                    {field.component}
                    <ErrorMessage>{errors[field.name]}</ErrorMessage>
                  </InputGroup>
                );
              } else {
                return (
                  <InputGroup $fullWidth={field.fullWidth} key={field.name || index}>
                    {renderInputField(field)}
                  </InputGroup>
                );
              }
            })}
            {children}
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