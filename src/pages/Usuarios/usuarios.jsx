import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import UserForm from '../../components/modals/userForm';
import Header from './internalComponents/header';
import Sidebar from '../../components/layout/sidebar';
import Toolbar from '../../components/layout/toolbar';
import Table from '../../components/tables/table'
import useEmployeeManagement from './useEmployeeManagement';
import {columnsEmployees} from './columnsEmployees'; 
import CustomButton from '../../components/ui/button';
import { Pencil, UserMinus, UserRoundPen, User, SquareUserRound, ToggleLeft, UserPen } from "lucide-react";
import filterData from '../../utils/unitySearch';
import getOrderRegister from '../../utils/getLastRegister';
import { ImTextColor } from 'react-icons/im';

const Usuarios = () => {
  const [selectedRows, setSelectedRows] = useState([]); //estado para las filas seleccionadas
  const [editingEmployee, setEditingEmployee] = useState(null); //estado para los datos del empleado a editar
  const [editingUser, setEditingUser] = useState(null); //estado para el usuario a editar
  const [activateForm, setActivateForm] = useState(null);// estado para la activacion del formulario segun se nececite
  const [searchText, setSearchText] = useState(''); //estado para el filtro search para saber q escribe el usuario
  const [statusFilter, setStatusFilter] = useState(''); //estado para el filtro dropdwon de los estados
  const [expandedRow, setExpandedRow] = useState(null); // estado para las filas expandidas (para mostra la informacion de cada usuario del empleado)
  const [employeeForUser, setEmployeeForUser] = useState(null); //estado para la asigancion directa del usuario con la relaicon del empleado 


  const {employees, branches, createEmployee, updateEmployee, deleteEmployee, createUser, updateUser, deleteUser} = useEmployeeManagement();

  const handleToggleExpand = (id) => {
    console.log('ID recibido para expandir/contraer:', id);
    setExpandedRow(prev => {
      const newValue = prev === id ? null : id;
      console.log('Nuevo valor de expandedRow:', newValue);
      return newValue;
    });
  };

    const handleAssignClick = (employee) => {
    setEmployeeForUser(employee);
    setActivateForm("Crear Usuario");
  };

  // columns que usa handleToggleExpand
  const columns = columnsEmployees(handleToggleExpand, expandedRow, handleAssignClick);

  const roles = {
    "AD": "Administrador",
    "PR": "Perito",
    "RC": "Recepcionista",
    "CA": "Administrador Convenio", 
    "CC": "Consultor Convenio",  
  };

    const estado = {
    "AC": "Activo",
    "IN": "Inactivo",
  };

  const renderUserDetails = (row) => {
  return (
    <div style={{ 
      padding: '16px', 
      backgroundColor: '#E6E8EB',
      borderTop: '1px solid #B4B8BC'
    }}>
      <div style={{color:'blue'}}><strong>Informacion de Usuario</strong></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', justifyItems: 'center'}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={20} />
          <strong>Usuario -</strong> {row.nombre_usuario || 'No asignado'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <SquareUserRound size={20} />
          <strong>Rol - </strong> {roles[row.rol_usuario] || 'No disponible'}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'start' }}>
          <ToggleLeft size={20} />
          <strong>Estado - </strong> {estado[row.estado_usuario] || 'No disponible'}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
        marginBottom: '12px', paddingTop: '20px' }}>
        <div style={{ display: 'flex', gap: '18px', paddingRight: '20px' }}>
          <CustomButton
            bgColor="#4F98D3"
            hoverColor="#3E86C2"
            width="170px"
            height="35px"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUserClick(row);
            }}
          >
            <UserPen size={16} /> Editar Usuario
          </CustomButton>
          
          <CustomButton
            bgColor="#dc3545"
            hoverColor="#c82333"
            width="170px"
            height="35px"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(row);
              // Aquí puedes agregar la lógica para eliminar
            }}
          >
            <UserMinus size={16} /> Eliminar Usuario
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

  useEffect(() => {
  if (activateForm === "Editar empleado") {
    console.log("Datos del empleado a editar:", editingEmployee);

  }
}, [activateForm, editingEmployee, branches]);

  const handleSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setActivateForm("Crear");
  };

  const handleEditEmployee = () => {
    if (selectedRows.length === 0) {
      alert("Por favor selecciona un registro para editar");
    }
    else if (selectedRows.length >= 2) {
      alert("Por favor selecciona exactamente un registro para editar");
    } else {
      // Busca el empleado completo basado en el ID seleccionado ya que selectedRows es solo el id no todo el employee completo que es lo q se nececita
      const employeeToEdit = employees.find(emp => emp.id === selectedRows[0]); //obtenemos solo el primero para que en caso de falla solo modifica/edita el primero encontrado ya q no se puede hacer ediciones multiples 
      setEditingEmployee(employeeToEdit); //le pasamos employee to edit ya con la informacion completa de ese registro 
      setActivateForm("Editar empleado"); 
    }
  };

  const handleEditUserClick = (userData) => {
    setEditingUser(userData);
    setActivateForm("Editar Usuario");
  };

  const cancelForm = () => {
    setActivateForm(null);
    setEditingEmployee(null); 
  };

  const submitForm = async (newEmployeeData) => {
    try {
      await createEmployee(newEmployeeData)
      setActivateForm(null)
      Swal.fire("¡Éxito!", "Empleado creado correctamente", "success");
    } catch (error) {
    }
  };


  const submitFormUser = async (newUserData) => {
    try {
      await createUser({
        ...newUserData,
        id_empleado: employeeForUser.id
      });

      setActivateForm(null);
      setEmployeeForUser(null);

      // Solo mostramos el Swal si no falló la petición
      Swal.fire("¡Éxito!", "Usuario asignado correctamente", "success");
    } catch (error) {
      // No mostramos Swal aquí porque ya lo hace handleAxiosError automáticamente
      console.log("Error capturado en submitFormUser");
    }
  };


  const handleUpdateEmployee = async (updateDataEmployee) => {
    try {
      await updateEmployee(editingEmployee.id, updateDataEmployee);
      Swal.fire("¡Éxito!", "Empleado actualizado", "success");
      setActivateForm(null)
    } catch (error) {

    }
  };

  const handleUpdateUser = async (updatedUserData) => {
    try {
      await updateUser(editingUser.id_usuario_real, updatedUserData);
      Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success");
      setActivateForm(null);
      setEditingUser(null);
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
      console.error(error);
    }
  };

  const handleDeleteEmloyee = async (selectedRows) =>  {
    if (selectedRows.length === 0) {
    alert("Porfavor selecciona por lo menos un empleado para eliminar")
    } else {
      await deleteEmployee(selectedRows)
    }
  };

  const handleDeleteUser = async (userData) => {
    try {
      const result = await Swal.fire({
        title: `¿Eliminar usuario ${userData.nombre_usuario}?`,
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await deleteUser(userData.id_usuario_real);
        Swal.fire(
          '¡Eliminado!',
          'El usuario ha sido eliminado correctamente.',
          'success'
        );
        // Cierra la fila expandida si está abierta
        setExpandedRow(null);
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'No se pudo eliminar el usuario',
        'error'
      );
      console.error("Error al eliminar usuario:", error);
    }
  };

    const filteredData = filterData({
    data: employees,
    searchText,
    searchFields: ['nombres', 'apellidos', 'cedula', 'correo','sucursal'],
    statusField: 'estado',
    statusFilter,
  });

  const orderData = getOrderRegister({ data: filteredData });

  return (
    <div>
      <Sidebar />
      <Header />
      <Toolbar
              onCreate={handleCreateEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmloyee}
              buttonsGap="40px"
              editLabel="Editar"
              onActiveButton={true}
            >
              <Toolbar.Search 
                placeholder="Buscar..." 
                onSearch={setSearchText}
              />
              <Toolbar.Dropdown 
                  options={{ AC: 'Activo', IN: 'Inactivo', '': 'Todos' }}
                  onSelect={setStatusFilter}
                onSearch={setSearchText}
              />
            </Toolbar>
      <Table
        data={orderData}
        onSelectionChange={handleSelectionChange}
        selectable={true}
        columns={columns}
        containerStyle={{ fontSize: '13px' }}
        expandable={true}
        renderExpandedContent={renderUserDetails}
        expandedRows={expandedRow ? [expandedRow] : []}
      />

      {(activateForm === "Crear" || activateForm === "Editar empleado") &&(
        <UserForm 
          title={activateForm === "Crear" ? "Crear Nuevo Empleado" : 'Editar Empleado'}
          onSubmit={activateForm === "Crear" ? submitForm : handleUpdateEmployee}
          fields = {[
            {
              name: "nombres",
              label: "Nombres",
              placeholder: "Nombre", 
              type: "text", 
              required: true
            },
            {
              name: "apellidos",
              label: "Apellidos",
              placeholder: "Apellidos", 
              type: "text", 
              required: true
            },
            {
              name: "cedula",
              label: "Cédula",
              placeholder: "Identificación", 
              type: "text", 
              required: true
            },
            {
              name: "correo",
              label: "Correo electronico",
              placeholder: "user.ejemplo@gmail.com", 
              type: "text", 
              required: true
            },
            {
              name: "estado",
              label: "Estado",
              type: "select", 
              options: [
                {value: "AC", label: "Activo"},
                {value: "IN", label: "Inactivo"}
              ],
              required: true,
              defaultValue: 'AC',
            },
            {
              name: "id_sucursal",
              label: "Sucursal",
              type: "select", 
              options: branches?.map(bra => ({
                value: bra.id,
                label: bra.nombre
              })) || [],
              required: true
            },
          ]}
          onCancel={cancelForm}
          initialValues={editingEmployee}
        />
      )}

      {(activateForm === "Crear Usuario") && (
        <UserForm 
          title={`Asignar Usuario a ${employeeForUser?.nombres} ${employeeForUser?.apellidos}`}
          onSubmit={submitFormUser}
          fields={[
            {
              name: "usuario",
              label: "Nombre de Usuario",
              type: "text",
              required: true
            },
            {
              name: "password",
              label: "Contraseña",
              type: "password", 
              required: true
            },
            {
              name: "rol",
              label: "Rol",
              type: "select",
              options: [
                {value: "AD", label: "Administrador"},
                {value: "PR", label: "Perito"},
                {value: "RC", label: "Recepcionista"},
                {value: "CA", label: "Administrador Convenio"},
                {value: "CC", label: "Consultor Convenio"}
              ],
              required: true
            },
            {
              name: "estado",
              label: "Estado",
              type: "select",
              options: [
                {value: "AC", label: "Activo"},
                {value: "IN", label: "Inactivo"}
              ],
              required: true,
              defaultValue: 'AC',
            }
          ]}
          onCancel={() => {
            setActivateForm(null);
            setEmployeeForUser(null);
          }}
        />
      )}

      {(activateForm === "Editar Usuario" && editingUser) && (
      <UserForm 
        title={`Editar Usuario de ${editingUser.nombres}`}
        onSubmit={handleUpdateUser}
        fields={[
          {
            name: "usuario",
            label: "Nombre de Usuario",
            type: "text",
            required: true
          },
          {
            name: "rol",
            label: "Rol",
            type: "select",
            options: [
              {value: "AD", label: "Administrador"},
              {value: "PR", label: "Perito"},
              {value: "RC", label: "Recepcionista"},
              {value: "CA", label: "Administrador Convenio"},
              {value: "CC", label: "Consultor Convenio"}
            ],
            required: true
          },
          {
            name: "estado",
            label: "Estado",
            type: "select",
            options: [
              {value: "AC", label: "Activo"},
              {value: "IN", label: "Inactivo"}
            ],
            required: true
          }
        ]}
        onCancel={() => {
          setActivateForm(null);
          setEditingUser(null);
        }}
        initialValues={{
          usuario: editingUser.nombre_usuario,
          rol: editingUser.rol_usuario,
          estado: editingUser.estado_usuario
        }}
      />
    )}
    </div>
  );
}

export default Usuarios;