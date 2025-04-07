import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Toolbar from "../components/Toolbar";
import UserTable from "../components/UserTable";
import UserForm from "../components/Form/userForm";
import useEmployeeManagement from "../hooks/useEmployeeManagement";
import { addEmployees, addUsers, editUsers } from "../api/api_Usuarios"; // Importar función API para creación
import AsignForm from "../components/Form/asignForm"; // Ajusta la ruta según la ubicación del archivo
import UpdateForm from "../components/Form/updateForm";
import Swal from "sweetalert2";


const Usuarios = () => {
  const {
    employees, // Todos los empleados
    filteredEmployees, // Empleados filtrados
    selectedEmployees, // IDs de empleados seleccionados
    expandedRow, // ID de la fila expandida
    handleBuscar, // Función para buscar empleados
    handleEliminar, // Función para eliminar empleados seleccionados
    setExpandedRow, // Actualiza la fila expandida
    setSelectedEmployees, // Actualiza los empleados seleccionados
    setEmployees, // Agregado para actualizar empleados
    setFilteredEmployees, // Agregado para actualizar empleados filtrados
  } = useEmployeeManagement(); // Hook personalizado para la lógica de empleados

  const [showCreateForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); //Usuario seleccionado
  const [editingUser, setEditingUser] = useState(null);

  const handleCrearUsuario = (usuario) => {
    console.log("Crear una cuenta para usuario:", usuario)
    setSelectedUser(usuario);
    setShowForm(true)
  }

  const handleCrearCuenta = (usuario) => {
    console.log("Crear una cuenta para usuario:", usuario)
    setSelectedUser(usuario);
    setShowAssignForm(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      console.log("Datos enviados al servidor:", formData); // Depuración
      const newEmployee = await addEmployees(formData); // Llamada al backend
      console.log("Respuesta del backend:", newEmployee);

      // Actualizar lista de empleados en el estado
      setEmployees((prev) => [newEmployee, ...prev]);
      setFilteredEmployees((prev) => [newEmployee, ...prev]);

      // Notificar al usuario
      setShowForm(false);
      await Swal.fire({
        title: "¡Éxito!",
        text: "El usuario ha sido creado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar"
      });

      // Ocultar formulario
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el usuario. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  };

  const handleFormSubmitCuenta = async (formData) => {
    try {
      console.log("Asignando cuenta para el usuario:", selectedUser, "con datos:", formData);
  
      // Crear el payload que se enviará al backend
      const payload = {
        id_empleado: selectedUser.id, // Asociar la cuenta con el empleado seleccionado
        usuario: formData.usuario,
        password: formData.password,
        rol: formData.rol,
        estado: formData.estado,
      };
      console.log("Payload: ",payload)
      // Llamada a la API para asignar la cuenta
      const response = await addUsers(payload); // Cambia `addUsers` por tu función API correspondiente
      console.log("Cuenta asignada con éxito:", response);
  
      // Actualizar la lista de empleados para reflejar el cambio
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedUser.id ? { ...emp, cuenta_usuario: response } : emp
        )
      );
  
      setFilteredEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedUser.id ? { ...emp, cuenta_usuario: response } : emp
        )
      );
  
      // Mostrar notificación de éxito
      Swal.fire({
        title: "¡Éxito!",
        text: "La cuenta ha sido asignada correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
  
      // Limpiar el estado y cerrar el formulario
      setShowAssignForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error al asignar la cuenta:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo asignar la cuenta. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleFormActualizarCuenta = async (id, formData) => {
    try{
      console.log("Enviando datos para editar usuario:", id, formData);

      const response = await editUsers(id, formData);
      console.log("Usuario editado con éxito", response);

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, cuenta_usuario: { ...formData } } : emp
        )
      );

      Swal.fire({
        title: "¡Éxito!",
        text: "El usuario ha sido editado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      
      setEditingUser(null); //Liberar el usuario y cerrar el formulario;
    } catch (error) {
      console.error("Error al editar el usuario" , error);
      Swal.fire({
        title: "Error",
        text: "No se pudo editar el usuario. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  }

  const handleCreateNew = () => {
    setShowForm(true); // Mostrar formulario de creación
  };


  const handleCancelForm = () => {
    setShowForm(false); // Cerrar formulario sin guardar
  };

  const handleVerUsuario = (usuario) => {
    setEditingUser(usuario);
  }

  return (
    <div>
      <Sidebar />
      <Header /> {/* Encabezado */}
      <Toolbar
        onSearch={handleBuscar} // Búsqueda
        onDelete={handleEliminar} // Eliminar
        onEdit={() => console.log("Editar empleado seleccionado")} // Placeholder para editar
        onCreate={handleCreateNew} // Crear nuevo empleado
      />
      {/* Formulario de creación, visible cuando showForm es true */}
      {showCreateForm && (
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
          onCancel={handleCancelForm}
        />
      )}
      {showAssignForm && (
        <AsignForm
          showForm={showAssignForm}
          selectedUser={selectedUser}
          handleFormSubmitCuenta={handleFormSubmitCuenta}
          setShowForm={setShowAssignForm}
          setSelectedUser={setSelectedUser}
        />
      )}

      {editingUser && (
        <UpdateForm
        user={editingUser}
        onSubmit={(formData) => handleFormActualizarCuenta(editingUser.id, formData)}
        onCancel={() => setEditingUser(null)}
        />
      )}

      {/* Tabla de empleados */}
      <UserTable
        filteredEmployees={filteredEmployees}
        selectedEmployees={selectedEmployees}
        expandedRow={expandedRow}
        handleCheckboxChange={setSelectedEmployees}
        toggleRow={setExpandedRow}
        handleCrearUsuario={handleCrearUsuario}
        handleCrearCuenta={handleCrearCuenta}
        handleVerUsuario={handleVerUsuario}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />
    </div>
  );
};

export default Usuarios;