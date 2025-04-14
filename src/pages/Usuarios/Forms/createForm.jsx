import React, { useState, useEffect } from "react";
import UserForm from "../../../components/userForm";
import axios from "axios";
import {axiosWithAuth} from "../../../api/api_Manager"

const CreateForm = ({ showForm, setShowForm, handleFormSubmit }) => {
    const [sucursales, setSucursales] = useState([]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/sucursal/get/`) // o la ruta correcta que tengas
            .then((response) => {
                setSucursales(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar sucursales:", error);
            });
    }, []);

    if (!showForm) return null;


    const onSubmit = (formData) => {
        handleFormSubmit(formData);
    };

    return (
        <UserForm
            title="Crear Nuevo Empleado"
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
                {
                    name: "id_sucursal",
                    placeholder: "Sucursal",
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
