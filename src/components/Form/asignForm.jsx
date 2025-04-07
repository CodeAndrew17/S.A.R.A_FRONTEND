import React from "react";
import UserForm from "./userForm"; // Asegúrate de que la ruta a UserForm sea correcta

const AsignForm = ({ showForm, selectedUser, handleFormSubmitCuenta, setShowForm, setSelectedUser }) => {
  if (!showForm) return null; // No renderizar si showForm es false

  return (
    <UserForm
      title={`Asignar Cuenta a ${selectedUser?.nombres} ${selectedUser?.apellidos}`}
      fields={[
        { name: "usuario", placeholder: "Nombre de Usuario", type: "text", required: true },
        { name: "password", placeholder: "Contraseña", type: "password", required: true },
        {
          name: "rol",
          placeholder: "Rol",
          type: "select",
          options: [
            { value: "AD", label: "Administrador" },
            { value: "PR", label: "Perito" },
            { value: "RC", label: "Recepcionista" },
            { value: "CA", label: "Administrador Convenio" },
            { value: "CC", label: "Consultor Convenio" },
          ],
          required: true,
        },
        {
          name: "estado",
          placeholder: "Estado",
          type: "select",
          options: [
            { value: "AC", label: "Activo" },
            { value: "IN", label: "Inactivo" },
          ],
          required: true,
        },
      ]}
      onSubmit={(formData) => handleFormSubmitCuenta(formData)} // Envía los datos del formulario
      onCancel={() => {
        setShowForm(false);
        setSelectedUser(null); // Limpia el usuario seleccionado
      }}
    />
  );
};

export default AsignForm;