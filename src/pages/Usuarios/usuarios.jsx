import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import Header from "./internalComponents/header";
import Toolbar from "./internalComponents/UserToolbar";
import UserTable from "./internalComponents/userTable";
import UserForm from "../../components/userForm";
import useEmployeeManagement from "./hooks/useEmployeeManagement";
import { addEmployees, addUsers, editUsers, deleteUsers, deleteEmployees, editEmployees ,getUsers} from "../../api/api_Usuarios"; 
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
    handleFilter
  } = useEmployeeManagement(); // Hook personalizado para la lógica de empleados

  const [showCreateForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); //Usuario seleccionado
  const [editingUser, setEditingUser] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Añade esto con los otros estados


  const handleEditar = () => {
    if (selectedEmployees.length !== 1) {
      Swal.fire({
        title: "Error",
        text: "Es necesario seleccionar exactamente un empleado para proceder con la edición.",
        icon: "error"
      });
      return;
    }

    const empleadoAEditar = employees.find(emp => emp.id === selectedEmployees[0]);
    setEditingEmployee(empleadoAEditar);
  };

  // Función para guardar cambios
  const handleGuardarEdicion = async (formData) => {
    try {
      // 1. Enviar datos al backend
      const updatedEmployee = await editEmployees(editingEmployee.id, formData);

      // 2. Actualizar el estado local
      setEmployees(prev => prev.map(emp =>
        emp.id === editingEmployee.id ? updatedEmployee : emp
      ));

      setFilteredEmployees(prev => prev.map(emp =>
        emp.id === editingEmployee.id ? updatedEmployee : emp
      ));

      // 3. Cerrar y mostrar confirmación
      setEditingEmployee(null);
      Swal.fire("¡Actualizado!", "Datos del empleado guardados", "success");

    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire("Error", "No se pudieron guardar los cambios. Recuerda que los permisos de tu rol determinan tus accesos y acciones.", "error");
    }
  };

  const handleViewDetails = (usuarioId) => {
    const usuario = filteredEmployees.find(u => u.id == usuarioId);
    if (usuario) {
      setExpandedRow(expandedRow === usuarioId ? null : usuarioId);
      setEditingUser(usuario.cuenta_usuario ? {
        ...usuario.cuenta_usuario,
        id_empleado: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos
      } : null);
    }
  };

  const handleEditingUser = () => {
    if (editingUser) {
      setShowUpdateForm(true);
    } else {
      Swal.fire({
        title: "Error",
        text: "El usuario no tiene una cuenta asignada para editar",
        icon: "error"
      });
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
        text: "No se pudo crear el usuario. Recuerda que los permisos de tu rol determinan tus accesos y acciones.",
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
        text: "La cuenta no pudo ser asignada. Recuerda que los permisos de tu rol determinan tus accesos y acciones. ",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleFormActualizarCuenta = async (id, formData) => {
    try {
      const payload = {
        id,
        ...formData,
        id_empleado: editingUser.id_empleado
      };
  
      const updatedUser = await editUsers(id, payload);
      
      // Actualizar editingUser con los nuevos datos
      setEditingUser(updatedUser);
  
      // Función para actualizar empleados
      const updateEmployee = (emp) => {
        if (emp.id === payload.id_empleado) {
          return {
            ...emp,
            cuenta_usuario: updatedUser
          };
        }
        return emp;
      };
  
      // Actualizar ambos estados
      setEmployees(prev => prev.map(updateEmployee));
      setFilteredEmployees(prev => prev.map(updateEmployee));
  
      // Cerrar formulario y mostrar éxito
      setShowUpdateForm(false);
      Swal.fire("¡Éxito!", "Cambios guardados", "success");
      
    } catch (error) {
      Swal.fire("Error", "No se pudieron guardar los cambios. Recuerda que los permisos de tu rol determinan tus accesos y acciones.", "error");
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
    const [userList] =  await Promise.all([
      getUsers()
    ]);

    let continuar = true;
  
    if (selectedEmployees.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Es necesario seleccionar al menos un empleado para proceder con la eliminación. Por favor, realice una selección válida y vuelva a intentarlo.",
        icon: "error"
      });
      return;
    }

    const empleadosConCuenta = selectedEmployees.filter(id =>
      userList.some(user => user.id_empleado === id)
    );    
    //Validacion de cuenta de usuario
    const textoDinamico = empleadosConCuenta.length > 0
      ? `Hay ${empleadosConCuenta.length} empleado(s) con cuenta de usuario. ¿Deseas continuar?`
      : "¿Deseas eliminar los empleados seleccionados?";
    //arroja le alerta con el texto dinamico,sin importar el caso si la respuesta Es afirmativa se eliminan los empleados
    const resultado = await Swal.fire({
        title: "Revisión",
        text: textoDinamico,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
      console.log("ingrese a la validacion")
      continuar = resultado.isConfirmed;
      
    
  
    if (!continuar) return;

    try {
      for (const id of selectedEmployees) {
        await deleteEmployees(id);
      };

      // Actualizamos el estado local para eliminar los empleados
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => !selectedEmployees.includes(emp.id)) // Filtramos los empleados eliminados
      );

      setFilteredEmployees((prevFiltered) =>
        prevFiltered.filter((emp) => !selectedEmployees.includes(emp.id)) // Filtramos los empleados eliminados en el filtro también
      );

      Swal.fire({
        title: "Usuario(s) eliminado(s).",
        text: "Se eliminaron los usuarios correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar"
      })
      window.location.reload();

    } catch (error) {
      console.error("Hubo un error al eliminar los usuarios.", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al eliminar los usuarios. Recuerda que los permisos de tu rol determinan tus accesos y acciones.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  };


  return (
    <div>
    <Sidebar />

    <div>
      <Header /> {/* Encabezado */}
      <Toolbar
        onSearch={handleBuscar} // Búsqueda
        onDelete={handleEliminarUser} // Eliminar
        onEdit={handleEditar} // Placeholder para editar
        onCreate={handleCreateNew} // Crear nuevo empleado
        
        onfilter={handleFilter}
        
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
    showForm={showUpdateForm}
    selectedUser={editingUser}
    handleFormActualizarCuenta={handleFormActualizarCuenta}
    setShowForm={setShowUpdateForm}
    onCancel={() => {
      setShowUpdateForm(false);
      setEditingUser(null);
    }}
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
        handleViewDetails={handleViewDetails} // Pasa el manejador
        handleEditingUser={handleEditingUser} // Pasa el manejador
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        setEmployees={setEmployees}
        employees={employees}
        setFilteredEmployees={setFilteredEmployees} // Pasar la lista de empleados al componente UserTable
      />
    </div>
    </div>
  );
};

export default Usuarios;