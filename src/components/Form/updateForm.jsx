import React from "react";
import UserForm from "./userForm";

const UpdateForm = ({ showForm, selectedUser, handleFormActualizarCuenta, setShowForm, setSelectedUser }) => {
    if (!showForm) return null;

    return (
        <UserForm
            title={`Actualizar los datos de ${selectedUser?.nombres} ${selectedUser?.apellidos}`}
            fields={[
                { name: "usuario", placeholder: "Nombre de usuario", type: "text", required: true },
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
            onSubmit={(formData) => handleFormActualizarCuenta(formData)} // Envía los datos del formulario
            onCancel={() => {
                setShowForm(false);
                setSelectedUser(null); // Limpia el usuario seleccionado
            }}
        />
    );
};

export default UpdateForm;