import React, { useState, useEffect } from "react";
import UserForm from "../../../components/userForm";
import {getBranches} from "../../../api/api_Usuarios"

const CreateForm = ({ showForm, setShowForm, handleFormSubmit }) => {
    const [sucursales, setSucursales] = useState([]);

    useEffect(() => {
        const fetchSucursales = async () => {
            try{
                const data = await getBranches();
                setSucursales(data)
            } catch (error){
                console.error("Error al obtener sucursales", error);
            }
        };
        fetchSucursales();
    }, []);

    if (!showForm) return null;


    const onSubmit = (formData) => {
        handleFormSubmit(formData);
    };

    return (
        <UserForm
            title="Crear Nuevo Empleado"
            fields={[
                { name: "nombres",label: "Nombres", placeholder: "Nombres", type: "text", required: true },
                { name: "apellidos",label: "Apellidos", placeholder: "Apellidos", type: "text", required: true },
                { name: "cedula",label: "Cédula", placeholder: "Cédula", type: "text", required: true },
                { name: "correo",label: "Correo Electrónico", placeholder: "usuario.ejemplo@email.com", type: "email", required: true },
                {
                    name: "estado",
                    label: "Estado",
                    placeholder: "Estado",
                    type: "select",
                    options: [
                        { value: "AC", label: "Activo" },
                        { value: "IN", label: "Inactivo" }
                    ],
                    required: true,
                    defaultValue: "Activo"
                },
                {
                    name: "id_sucursal",
                    label: "Sucursal",
                    placeholder: "Seleccionar",
                    type: "select",
                    options: sucursales.map(s => ({ value: s.id, label: s.nombre })),
                    required: true,
                }
            ]}
            onSubmit={onSubmit}
            onCancel={() => setShowForm(false)}
        />
    );
};

export default CreateForm;
