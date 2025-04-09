import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "./internalComponents/header";
import Toolbar from "./internalComponents/Toolbar";
import UserTable from "./internalComponents/userTable";
import UserForm from "../../components/userForm";
import useEmployeeManagement from "./hooks/useEmployeeManagement";
import { addEmployees, addUsers, editUsers, deleteUsers, deleteEmployees } from "../../api/api_Usuarios"; // Importar función API para creación
import CreateForm from "./Forms/createForm";
import AsignForm from "./Forms/asignForm"; // Ajusta la ruta según la ubicación del archivo
import UpdateForm from "./Forms/updateForm";
import Swal from "sweetalert2";
import EmployeeUpdateForm from "./Forms/EmployeeUpdateForm";


const Usuarios = () => {
  const {
    employees, // Todos los empleados
    filteredEmployees, // Empleados filtrados
    selectedEmployees, // IDs de empleados seleccionados
    expandedRow, // ID de la fila expandida
    handleBuscar, // Función para buscar empleados
    handleEliminar,
    handleCheckboxChange, // Función para eliminar empleados seleccionados
    setExpandedRow, // Actualiza la fila expandida
    setSelectedEmployees, // Actualiza los empleados seleccionados
    setEmployees, // Agregado para actualizar empleados
    setFilteredEmployees, // Agregado para actualizar empleados filtrados
    handleEditarEmpleado,
    sucursalesMap,
  } = useEmployeeManagement(); // Hook personalizado para la lógica de empleados

  const [showCreateForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); //Usuario seleccionado
  const [editingUser, setEditingUser] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleEditar = () => {
    if (selectedEmployees.length !== 1) {
      Swal.fire({
        title: "Error",
        text: "Por favor seleccione exactamente un empleado para editar",
        icon: "error"
      });
      return;
    }
    
    const empleadoAEditar = employees.find(emp => emp.id === selectedEmployees[0]);
    setEditingEmployee(empleadoAEditar);
  };

  // Función para guardar cambios
  const handleGuardarEdicion = async (formData) => {
    const exito = await handleEditarEmpleado(editingEmployee.id, formData);
    
    if (exito) {
      Swal.fire("¡Éxito!", "Empleado actualizado correctamente", "success");
      setEditingEmployee(null);
    } else {
      Swal.fire("Error", "No se pudo actualizar el empleado", "error");
    }
  };

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
      console.log("Payload: ", payload)
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
    try {
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
      console.error("Error al editar el usuario", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo editar el usuario. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar",

      });
    }
  };

  const handleSaveEditUsuario = (usuario) => {
    setEditingUser(usuario);
  }

  const handleCreateNew = () => {
    setShowForm(true); // Mostrar formulario de creación
  };


  const handleCancelForm = () => {
    console.log("Botón de cancelar presionado");
    setShowForm(false); // Cerrar formulario sin guardar
  };

  const handleVerUsuario = (usuario) => {
    setEditingUser(usuario);
  }

  const handleEliminarUser = async () => {
    if (selectedEmployees.length === 0) return alert("Seleccione al menos un usuario.");

    const confirmacion = window.confirm("Está seguro de que desea eliminar los usuarios seleccionados? Esta acción no se puede deshacer");
    if (!confirmacion) return;

    try {
      for (const id of selectedEmployees) {
        await deleteEmployees(id);
      };

      Swal.fire({
        title: "Usuario(s) eliminado(s).",
        text: "Se eliminaron los usuarios correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar"
      })
      window.location.reload();

    } catch (error) {
      console.error("Hubo un error al eliminar los usuarios.", error);
      alert("Ocurrió un error al eliminar usuarios");
    }

  }

  return (
    <div>
      <Sidebar />
      <Header /> {/* Encabezado */}
      <Toolbar
        onSearch={handleBuscar} // Búsqueda
        onDelete={handleEliminarUser} // Eliminar
        onEdit={handleEditar} // Placeholder para editar
        onCreate={handleCreateNew} // Crear nuevo empleado
      />
      {/* Formulario de creación, visible cuando showForm es true */}
      {showCreateForm && (
        <CreateForm
          showForm={showCreateForm}
          handleFormSubmit={handleFormSubmit}
          onSubmit={handleFormSubmit}
          setShowForm={setShowForm}
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

      {/* Formulario de edición */}
      {editingEmployee && (
        <UpdateForm
          employee={editingEmployee}
          onSubmit={handleGuardarEdicion}
          onCancel={() => setEditingEmployee(null)}
        />
      )}

      {editingEmployee && (
        <EmployeeUpdateForm
          employee={editingEmployee}
          sucursalesMap={sucursalesMap}
          onSubmit={handleGuardarEdicion}
          onCancel={() => setEditingEmployee(null)}
        />
      )}

      {/* Tabla de empleados */}
      <UserTable
        filteredEmployees={filteredEmployees}
        selectedEmployees={selectedEmployees}
        expandedRow={expandedRow}
        handleCheckboxChange={handleCheckboxChange}
        toggleRow={setExpandedRow}
        handleCrearUsuario={handleCrearUsuario}
        handleCrearCuenta={handleCrearCuenta}
        handleVerUsuario={handleVerUsuario}
        editingUser={editingUser}
        setEditingUser={setEditingUser} 
        setEmployees={setEmployees}      
        employees={employees}
        setFilteredEmployees={setFilteredEmployees} // Pasar la lista de empleados al componente UserTable
      />
    </div>
  );
};

export default Usuarios;