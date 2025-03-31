import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import styled from "styled-components";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import Button from "../components/button";
import UserForm from "../components/userForm"; 
import { Compass, Trash, Edit, Plus, Eye, UserPlus, Pencil, UserMinus } from "lucide-react";
import {getEmployees, deleteEmployees, editEmployees, addEmployees, getBranches, getUsers, addUsers, editUsers} from '../api/api_Usuarios';


const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 10px; /* Espaciado del fondo */
  height: 60px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  line-height: 10px;
  margin: 0; /* Para que no interfiera con el diseño */
  position: relative;
  top: 20px; /* Ajusta el texto sin afectar el fondo */
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
  margin-left: 50px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 90%;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

//styles de la tabla
const TableContainer = styled.div`
  width: calc(100% - 80px); /* Ocupa todo el ancho menos el espacio del sidebar */
  margin: 20px 0 20px 80px; /* Margen izquierdo para el sidebar */
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Ajusta los anchos de las columnas para que se distribuyan adecuadamente
const TableHeader = styled.th`
  background-color: #5FB8D6;
  color: white;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-size: 13px;
  /* Define anchos específicos para cada columna */
  &:nth-child(1) { width: 17%; }   /* Checkbox */
  &:nth-child(2) { width: 15%; }  /* Nombres */
  &:nth-child(3) { width: 15%; }  /* Apellidos */
  &:nth-child(4) { width: 15%; }  /* Cédula */
  &:nth-child(5) { width: 25%; }  /* Correo */
  &:nth-child(6) { width: 15%; }  /* Estado */
  &:nth-child(7) { width: 15%; }  /* Sucursal */
  &:nth-child(8) { width: 15%; }  /* Usuario */
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CheckboxCell = styled.td`
  text-align: center;`;


const Usuarios = () => {
  const [showForm, setShowForm] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [expandedRow, setExpandRow] = useState(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null); 
  const [editingUser, setEditingUser] = useState(null);
  const [showEditUserForm, setShowEditUserForm] = useState(false);

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const [empleadosData, sucursalesData, userData] = await Promise.all([
          getEmployees(),
          getBranches(),
          getUsers()
        ]);

        const sucursalesMap = {};
        sucursalesData.forEach(sucursal => {
          sucursalesMap[sucursal.id] = sucursal.nombre;
        });

        const userAccountsMap = {};
        userData.forEach(user => {
          userAccountsMap[user.id_empleado] = {id:user.id,
            usuario:user.usuario, 
            rol: user.rol,
            estado: user.estado
          }; //relaciona usuario con empleado 
        });

        const empleadosConDatos = empleadosData.map(emp => ({
          ...emp,
          sucursal_nombre: sucursalesMap[emp.id_sucursal] || "Sucursal no asignada",
          cuenta_usuario: userAccountsMap[emp.id] || null //si tiene cuenta se la asigna
        }));

        const empleadosOrdenados = empleadosConDatos.sort((a, b) => b.id - a.id);

        setEmpleados(empleadosOrdenados);
        setFilteredEmployees(empleadosOrdenados);
        setError(null);
      } catch (error) {
        setError("Error al cargar los empleados o sucursales");
      }
    };
    cargarEmpleados();
  },[]);  

  const handleSaveUserEdit = async (formData) => {
    try {
        const payload = {
            id: editingUser.id,
            usuario: formData.usuario,
            password: editingUser.password || undefined,
            rol: formData.rol,
            estado: formData.estado,
            id_empleado: editingUser.id_empleado,
            groups: editingUser.groups || [],
            user_permissions: editingUser.user_permissions || []
        };

        // Guardar cambios en el servidor
        const updatedUser = await editUsers(payload.id, payload);

        // Actualizar el estado de empleados
        setEmpleados(prev => prev.map(emp => {
            if (emp.cuenta_usuario?.id === payload.id) {
                return {
                    ...emp,
                    cuenta_usuario: {
                        ...emp.cuenta_usuario,
                        ...updatedUser  // Usar los datos devueltos por el servidor
                    }
                };
            }
            return emp;
        }));

        // Actualizar filteredEmployees también
        setFilteredEmployees(prev => prev.map(emp => {
            if (emp.cuenta_usuario?.id === payload.id) {
                return {
                    ...emp,
                    cuenta_usuario: {
                        ...emp.cuenta_usuario,
                        ...updatedUser
                    }
                };
            }
            return emp;
        }));

        alert("¡Usuario actualizado con éxito!");
        setShowEditUserForm(false);
        setEditingUser(null);  // Limpiar el estado de edición
    } catch (error) {
        console.error("Error al guardar cambios:", error);
        alert(`Error: ${error.response?.data?.detail || "Hubo un problema al guardar"}`);
    }
};

  const handleEditarUsuario = (cuentaUsuario) => {
    console.log('Datos del usuario a editar:', cuentaUsuario); // Verifica los datos
    setEditingUser(cuentaUsuario);
    setShowEditUserForm(true);
    };

  const handleCrearCuenta = (empleado) => {
    console.log("Empleado para asignar cuenta:", {
      id: empleado.id,
      nombre: `${empleado.nombres} ${empleado.apellidos}`,
      tieneCuenta: !!empleado.cuenta_usuario
    });
    setEmpleadoSeleccionado(empleado);
    setShowCreateUserForm(true);
  };
  
  const handleAsignarCuenta = async (UserData) => {
    if (!empleadoSeleccionado) {
      alert("error no hay empleado asignado a la cuenta ");
    }

    const newUser = {
      id_empleado: empleadoSeleccionado.id,
      usuario: UserData.usuario,
      password: UserData.password,
      rol: UserData.rol,
      estado: UserData.estado,
    }

    try {
      const response = await addUsers(newUser);
      console.log("Respuesta del servidor:", response);
      alert("Cuenta asignada con exito");

      setShowCreateUserForm(false); 
      setEmpleadoSeleccionado(null);

      setEmpleados((prev) =>
        prev.map((emp) =>
          emp.id === empleadoSeleccionado.id
            ? { ...emp, cuenta_usuario: response }
            : emp
        )
      );
      setFilteredEmployees((prev) =>
        prev.map((emp) =>
          emp.id === empleadoSeleccionado.id
            ? { ...emp, cuenta_usuario: response }
            : emp
        )
      );
    } catch (error) {
      console.error("Error al asignar la cuenta", error);
      alert("Error al asignar la cuenta: "+ (error.response ? JSON.stringify(error.response.data) : error.message));
    }
  };

  const toggleRow = (id) => {
    setExpandRow(expandedRow === id ? null : id);
  };

  const handleCheckboxChange = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleBuscar = () => {
    if (search.trim() === "") {
      setFilteredEmployees(empleados);
    } else {
      const filtered = empleados.filter((empleado) =>
        empleado.cedula?.toString().includes(search.trim())
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleEliminar = async () => {
    if (selectedEmployees.length === 0) {
      alert("Por favor seleccione al menos un empleado para eliminar");
      return;
    }
    
    const confirmacion = window.confirm("¿Está seguro que desea eliminar los empleados seleccionados?");
    if (!confirmacion) return;
  
    try {
      for (const id of selectedEmployees) {
        await deleteEmployees(id);
      }
      
      alert("Eliminación exitosa");
  
      const nuevosEmpleados = empleados.filter(empleado => !selectedEmployees.includes(empleado.id));
      setEmpleados(nuevosEmpleados);
      setFilteredEmployees(nuevosEmpleados);
      setSelectedEmployees([]);
    } catch (error) {
      alert("Error al eliminar empleados",error);
    }
  };


  const handleEditar = () => {
    if (selectedEmployees.length !== 1){
    alert("Seleccione un solo usuario para editar ");
    return;
    }
    const empleadoSeleccionado = empleados.find(emp => emp.id === selectedEmployees[0]);

    if (!empleadoSeleccionado) {
      alert("Error: No se encontró el usuario seleccionado.");
      return;
    }
  
    console.log("Empleado seleccionado para editar:", empleadoSeleccionado); // Depuración
    setEditingEmployee(empleadoSeleccionado);
    setShowEditForm(true);
  };

  const handleSaveEdit = async (updateData) => {
    if (!updateData || Object.keys(updateData).length === 0){
      alert("no hay cambios para actualizar");
      return;
    }
    try{
      const updateEmployee = {...editingEmployee, ...updateData};
      await editEmployees(editingEmployee.id, updateEmployee);
      alert("usuario actualizado con exito");

      const empleadosActualizados = empleados.map(emp => 
        emp.id === editingEmployee.id ? {...emp, ...updateData} : emp
      );

      setEmpleados(empleadosActualizados);
      setFilteredEmployees(empleadosActualizados);
      setShowEditForm(false);
      setEditingEmployee(null);
    } catch (error){
      alert("error al editar empleado", error);
    }
  };

  const handleCrearNuevo = () => {
    setShowForm(true); // Mostrar el formulario cuando se hace clic en "Crear Nuevo"
  };

  const handleFormSubmit = async (newEmployeeData) => {
    console.log("Datos capturados antes de enviar:", newEmployeeData);// Cierra el formulario después de capturar los datos
    try{
      const newEmployee = await addEmployees(newEmployeeData);
      console.log("Respuesta del servidor:", newEmployee);

      setEmpleados((prev) => [newEmployee, ...prev]);
      setFilteredEmployees((prev) => [newEmployee, ...prev]);
      alert("Usuario creado con exito");
      setShowForm(false); 
    } catch (error){
      console.error("Error al crear usuario:", error.response ? error.response.data : error);
        alert("Error al agregar usuario: " + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEmpleadoSeleccionado(null); // Cierra el formulario sin guardar nada
  };

  const handleDropdownSelect = (option) => {
    console.log("Opción seleccionada:", option);
  };

  return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Panel de Usuarios</TitleText>
      </TitleWrapper>

      <TopBar>
        <FilterContainer>
          <Dropdown
            options={["Admin.", "Perito", "Recepcionista", "Ad. Convenio","Cons. Convenio", "Todos"]}
            onSelect={handleDropdownSelect}
            defaultOption="Rol"
          />

        <SearchBar 
          placeholder="Cédula" 
          width="280px" 
          onSearch={(value) => setSearch(value)} 
        />

        </FilterContainer>

        <ButtonContainer>
        <Button
          bgColor="#5AA9E6" 
          hoverColor="#4682B4" 
          width="130px"
          height="38px"
          onClick={handleBuscar}
        >
          <Compass /> Buscar
        </Button>

        <Button
          bgColor="#FF6B6B" 
          hoverColor="#D9534F" 
          width="130px"
          height="38px"
          onClick={handleEliminar}>
          <Trash /> Eliminar
        </Button>

        <Button
          bgColor="#5A9AC6" 
          hoverColor="#468BAF" 
          width="130px"
          height="38px"
          onClick={handleEditar}
        >
          <Edit /> Editar
        </Button>

          <Button
            bgColor="#5FB8D6"
            hoverColor="#519CB2"
            width="160px"
            height="38px"
            onClick={handleCrearNuevo}
          >
            <Plus /> Crear Nuevo
          </Button>

        </ButtonContainer>
      </TopBar>

      {showForm && (
        <FormContainer>
          <UserForm
            title="Crear Nuevo Usuario"
            fields={[
              { name: "nombres", placeholder: "Nombres", type: "text" },
              { name: "apellidos", placeholder: "Apellidos", type: "text" },
              { name: "cedula", placeholder: "Cédula", type: "text" },
              { name: "correo", placeholder: "Correo Electrónico", type: "email" },
              { name: "estado", placeholder: "Estado", type: "select", 
                options: [{value: "AC", label:"Activo (AC)"},
                  {value: "IN", label:"Inactivo (IN)"}
                ]
              },
              { name: "id_sucursal", placeholder: "Sucursal", type: "number" },
            ]}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </FormContainer>
      )}

    {showEditForm && editingEmployee &&(
      <>
      {console.log("Datos de edición:", editingEmployee)} {/*depuracion*/}
      <FormContainer>
        <UserForm
          title="Editar Usuario"
          fields={[
            { name: "nombres", placeholder: "Nombres", type: "text", defaultValue: editingEmployee?.nombres },
            { name: "apellidos", placeholder: "Apellidos", type: "text", defaultValue: editingEmployee?.apellidos },
            { name: "cedula", placeholder: "Cédula", type: "text", defaultValue: editingEmployee?.cedula },
            { name: "correo", placeholder: "Correo Electrónico", type: "email", defaultValue: editingEmployee?.correo },
            { name: "estado", placeholder: "Estado", type: "select", options: [{value: "AC", label:"Activo (AC)"},
              {value: "IN", label:"Inactivo (IN)"}], defaultValue: editingEmployee?.estado },
            { name: "id_sucursal", placeholder: "Sucursal", type: "number", defaultValue: editingEmployee?.id_sucursal },
          ]}
          onSubmit={handleSaveEdit}
          onCancel={() => setShowEditForm(false)}
        />
      </FormContainer>
      </>
    )}

      {showCreateUserForm && (
        <FormContainer>
          <UserForm
              key={`user-form-${empleadoSeleccionado?.id || 'new'}`}
              title={`Asignar Cuenta a ${empleadoSeleccionado?.nombres || 'Nuevo Usuario'}`} // Mostrar el nombre  de usuario dinamicamente
              fields={[
                { 
                  name: "usuario", 
                  placeholder: "Nombre de Usuario", 
                  type: "text", 
                  defaultValue: "",
                  autoComplete:"nope",
                },
                { 
                  name: "password", 
                  placeholder: "Contraseña", 
                  type: "password", 
                  defaultValue: "",
                  autoComplete: "new-password"
                },
                { 
                  name: "rol", 
                  placeholder: "Seleccione un rol", 
                  type: "select", 
                  options: [
                    {value: "AD", label: "Administrador"},
                    {value: "PR", label: "Perito"},
                    {value: "RC", label: "Recepcionista"},
                    {value: "CA", label: "Administrador Convenio"},
                    {value: "CC", label: "Consultor Convenio"}
                  ],
                  defaultValue: "" 
                },
                { 
                  name: "estado", 
                  placeholder: "Estado", 
                  type: "select", 
                  options: [
                    {value: "AC", label: "Activo"}, 
                    {value: "IN", label: "Inactivo"}
                  ],
                  defaultValue: "AC" 
                }
              ]}
              onSubmit={handleAsignarCuenta}
              onCancel={() => {
                setShowCreateUserForm(false);
                setEmpleadoSeleccionado(null);
              }}
            />
        </FormContainer>
      )}

        {showEditUserForm && editingUser && (
          <UserForm
            title="Editar Cuenta de Usuario"
            fields={[
              { 
                name: "usuario", 
                placeholder: "Nombre de Usuario", 
                type: "text",
                defaultValue: editingUser.usuario, // Valor inicial del campo
                required: true
              },
              { 
                name: "rol", 
                placeholder: "Seleccione un rol", 
                type: "select",
                defaultValue: editingUser.rol, // Valor inicial del campo
                options: [
                  { value: "AD", label: "Administrador" },
                  { value: "PR", label: "Perito" },
                  { value: "RC", label: "Recepcionista" },
                  { value: "CA", label: "Admin. Convenio" },
                  { value: "CC", label: "Consultor Convenio" }
                ],
                required: true
              },
              { 
                name: "estado", 
                placeholder: "Estado", 
                type: "select",
                defaultValue: editingUser.estado, // Valor inicial del campo
                options: [
                  { value: "AC", label: "Activo" },
                  { value: "IN", label: "Inactivo" }
                ],
                required: true
              }
            ]}
            onSubmit={handleSaveUserEdit}
            onCancel={() => {
              setShowEditUserForm(false);
              setEditingUser(null);
            }}
          />
        )}

      <TableContainer>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <StyledTable> 
          <thead>
            <tr>
            <TableHeader style={{ flex: '0.5', paddingLeft: '95px' }}>Seleccionar</TableHeader> {/* posicionamiento de los titulos de la tabla*/}
            <TableHeader style={{ flex: '1.5', paddingLeft: '10px' }}>Nombres</TableHeader>
            <TableHeader style={{ flex: '1.5', paddingLeft: '10px' }}>Apellidos</TableHeader>
            <TableHeader style={{ flex: '1.2', paddingLeft: '10px' }}>Cédula</TableHeader>
            <TableHeader style={{ flex: '2', paddingLeft: '10px' }}>Correo</TableHeader>
            <TableHeader style={{ flex: '1', paddingLeft: '15px' }}>Estado</TableHeader>
            <TableHeader style={{ flex: '1.5', paddingLeft: '20px' }}>Sucursal</TableHeader>
            <TableHeader style={{ flex: '1', paddingLeft: '15px' }}>Usuario</TableHeader>
            </tr>
          </thead>

          <tbody>
          {filteredEmployees.length > 0 ? ( 
            filteredEmployees.map((usuario) => (
              <React.Fragment key={usuario.id}>
                <TableRow key={usuario.id}>
                  <CheckboxCell>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(usuario.id)}
                      onChange={() => handleCheckboxChange(usuario.id)}
                    />
                  </CheckboxCell>
                    <TableCell>{usuario.nombres}</TableCell>
                    <TableCell>{usuario.apellidos}</TableCell>
                    <TableCell>{usuario.cedula}</TableCell>
                    <TableCell>{usuario.correo}</TableCell>
                    <TableCell style={{ position: "relative", left: "20px" }}>{usuario.estado}</TableCell>
                    <TableCell style={{ position: "relative", left: "-5px" }}>{usuario.sucursal_nombre}</TableCell>
                    <TableCell>
                      {usuario.cuenta_usuario ? (
                      <Button 
                        bgColor="#5A9AC6" 
                        hoverColor="#468BAF" 
                        width="100px"
                        height="30px"
                        onClick={() => toggleRow(usuario.id)}
                      >
                        <Eye />
                        {expandedRow === usuario.id ? "Ocultar" : "Ver"}
                      </Button>
                      ) : (
                        <Button
                        bgColor="#20C997"  
                        hoverColor="#1E8F77"
                        width="100px"
                        height="30px"
                        onClick={() => handleCrearCuenta(usuario)}
                      >
                        <UserPlus /> Asignar
                        </Button>
                      )}
                    </TableCell>
                </TableRow>

                {expandedRow === usuario.id && (
                  <TableRow>
                  <TableCell colSpan="8">
                  <div style={{
                      padding: "15px",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "20px"
                    }}>
                      {usuario.cuenta_usuario && (
                        <>
                          <div style={{ flex: 1, minWidth: "200px" }}>
                            <h4 style={{ color: "#5FB8D6", marginBottom: "10px" }}>Información de acceso</h4>
                            <p><strong>Usuario:</strong> {usuario.cuenta_usuario.usuario}</p>
                            <p><strong>Estado:</strong> 
                              <span style={{
                                backgroundColor: usuario.cuenta_usuario.estado === "AC" ? "#e6ffed" : "#fff5f5", 
                                color: usuario.cuenta_usuario.estado === "AC" ? "#28a745" : "#dc3545",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                marginLeft: "8px",
                                fontSize: "0.9em"
                              }}>
                                {usuario.cuenta_usuario.estado === "AC" ? "Activo" : "Inactivo"}
                              </span>
                            </p>
                          </div>
                          
                          <div style={{ flex: 1, minWidth: "200px" }}>
                            <h4 style={{ color: "#5FB8D6", marginBottom: "10px" }}>Rol </h4>
                            <div style={{
                              display: "inline-block",
                              backgroundColor: "#e6f7ff",
                              padding: "4px 12px",
                              borderRadius: "15px",
                              color: "#1890ff"
                            }}>
                              {{
                                'AD': 'Administrador del Sistema',
                                'PR': 'Perito',
                                'RC': 'Recepcionista',
                                'CA': 'Administrador de Convenios',
                                'CC': 'Consultor de Convenios'
                              }[usuario.cuenta_usuario.rol]}
                            </div>
                            <div style={{ marginTop: "15px", display: "flex", gap: "30px" }}>
                              <Button
                                bgColor="#5A9AC6"
                                hoverColor="#468BAF"
                                width="170px"
                                height="35px"
                                onClick={() => handleEditarUsuario(usuario.cuenta_usuario)}
                              >
                                <Pencil size={16} /> Editar Usuario
                              </Button>
                              
                              <Button
                                bgColor="#FF6B6B"
                                hoverColor="#D9534F"
                                width="170px"
                                height="35px"
                                onClick={() => handleEliminarUsuario(usuario.cuenta_usuario.id)}
                              >
                                <UserMinus size={16} /> Eliminar Usuario
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                  </TableCell>
                </TableRow>
                )}
              </React.Fragment>

              ))
            ) : (
              <tr>
                <TableCell colSpan="8" style={{ textAlign: "center" }}>
                  No hay usuarios disponibles
                </TableCell>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableContainer>
    </div>
  );
};

export default Usuarios;