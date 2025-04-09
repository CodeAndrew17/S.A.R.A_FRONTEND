import React from "react";
import UserForm from "./userForm";

const CreateForm = ({ showForm, setShowForm, handleFormSubmit }) => {
    if (!showForm) return null;

    return (
        <UserForm
            title="Crear Nuevo Usuario"
            fields={[
                { name: "nombres", placeholder: "Nombres", type: "text", required: true },
                { name: "apellidos", placeholder: "Apellidos", type: "text", required: true },
                { name: "cedula", placeholder: "Cédula", type: "text", required: true },
                { name: "correo", placeholder: "Correo Electrónico", type: "email", required: true },
                {
                    name: "estado",
                    placeholder: "Estado",
                    type: "select",
                    options: [
                        { value: "AC", label: "Activo" },
                        { value: "IN", label: "Inactivo" }
                    ],
                    required: true,
                },
                { name: "id_sucursal", placeholder: "Sucursal", type: "number", required: true },
            ]}
            onSubmit={handleFormSubmit}
            onCancel={() => {
                setShowForm(false); // Actualiza el estado directamente
            }}
        />
    );
};

export default CreateForm;