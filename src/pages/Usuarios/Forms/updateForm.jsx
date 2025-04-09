import React from "react";
import UserForm from "../../../components/userForm";
import Swal from "sweetalert2";

const UpdateForm = ({ 
    showForm, 
    selectedUser, 
    handleFormActualizarCuenta, // Esta función ahora debe manejar TODA la lógica de actualización
    setShowForm,
    onCancel // Nueva prop para manejar cancelación
  }) => {
    if (!showForm || !selectedUser) return null;

    const handleSubmit = async (formData) => {
        try {
          const payload = {
            id: selectedUser.id,
            ...formData,
            id_empleado: selectedUser.id_empleado
          };
          
          await handleFormActualizarCuenta(payload);
          
        } catch (error) {
          // El error ya fue manejado por handleFormActualizarCuenta
          console.error("Error en el formulario:", error);
        }
      };

  return (
    <UserForm
      title={`Actualizar a ${selectedUser.nombres} ${selectedUser.apellidos}`}
      fields={[
        {
          name: "usuario",
          placeholder: "Nombre de usuario",
          type: "text",
          defaultValue: selectedUser.usuario,
          required: true
        },
        {
          name: "rol",
          placeholder: "Rol",
          type: "select",
          defaultValue: selectedUser.rol,
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
          defaultValue: selectedUser.estado,
          options: [
            { value: "AC", label: "Activo" },
            { value: "IN", label: "Inactivo" },
          ],
          required: true,
        }
      ]}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

export default UpdateForm;