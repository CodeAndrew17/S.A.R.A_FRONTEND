import React from "react";
import UserForm from "../../../components/userForm"; // Tu componente original sin cambios

const EmployeeEditForm = ({ 
  employee, 
  onSubmit, 
  onCancel,
  sucursalesMap 
}) => {
  // Definimos los campos del formulario basados en tu estructura original
  const fields = [
    {
      name: "nombres",
      label: "Nombres",
      type: "text",
      placeholder: "Nombres",
      defaultValue: employee?.nombres || "",
      required: true
    },
    {
      name: "apellidos",
      label: "Apellidos",
      type: "text",
      placeholder: "Apellidos",
      defaultValue: employee?.apellidos || "",
      required: true
    },
    {
      name: "cedula",
      label: "Cédula",
      type: "text",
      placeholder: "Cédula",
      defaultValue: employee?.cedula || "",
      required: true
    },
    {
      name: "correo",
      label: "Correo",
      type: "email",
      placeholder: "Correo electrónico",
      defaultValue: employee?.correo || "",
      required: true
    },
    {
      name: "id_sucursal",
      label: "Sucursal",
      type: "select",
      placeholder: "Seleccionar",
      
      defaultValue: employee?.id_sucursal || "",
      
      options: Object.entries(sucursalesMap).map(([id, nombre]) => ({
        value: id,
        label: nombre
      })),
      required: true
      
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      placeholder: "Seleccionar",
      defaultValue: employee?.estado || "AC",
      options: [
        { value: "AC", label: "Activo" },
        { value: "IN", label: "Inactivo" }
      ],
      required: true
    }
  ];

  // Manejador de envío usando tu formulario original
  const handleSubmit = (formData) => {
    // Aquí manejamos los cambios correctamente
    const updatedFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== employee[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});
  
    // Si hay cambios, actualizamos el estado
    if (Object.keys(updatedFields).length > 0) {
      // Actualiza el estado del empleado y expande la fila
      onSubmit(updatedFields);
      setExpandedRow(usuario.id);  // Asegúrate de actualizar el expandedRow después de editar
    } else {
      console.log("No se realizaron cambios.");
    }
  };
  
  

  return (
    <UserForm
      title={`Editar Empleado: ${employee?.nombres || ''} ${employee?.apellidos || ''}`}
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      successMessage="¡Empleado actualizado con éxito!"  //  Mensaje personalizado
      successDescription="Los cambios se han guardado correctamente."
    />
  );
};

export default EmployeeEditForm;