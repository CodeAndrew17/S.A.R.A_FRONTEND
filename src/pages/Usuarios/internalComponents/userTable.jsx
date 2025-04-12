import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Eye, UserPlus, Pencil, UserMinus } from "lucide-react";
import CustomButton from "../../../components/button";
import { deleteUsers, getBranches } from "../../../api/api_Usuarios";
import UpdateForm from "../Forms/updateForm";
import Swal from "sweetalert2";
import { editUsers } from "../../../api/api_Usuarios";
import useEmployeeManagement from "../hooks/useEmployeeManagement";

// Estilos generales
const TableContainer = styled.div`
  width: 100%;
  margin: 30px 0; /* Elimina margen horizontal */
  background-color: #fff;
  padding: 20px 0; /* Elimina padding horizontal */
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto; /* Scroll horizontal si es necesario */
  margin-top: 5px;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: max-content; /* Asegura que la tabla no se encoja */
  table-layout: auto; /* Mantiene el comportamiento flexible */
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #5FB8D6;
  color: white;
  padding: 16px 12px;
  text-align: left;
  font-size: 15px;
  border-bottom: 2px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f6fafd;
  }
`;

const TableCell = styled.td`
  padding: 14px 12px;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Clases para mover columnas individualmente */
  /* AJUSTA ESTOS VALORES SEGÚN NECESITES */
  &.columna-seleccionar { padding-left: 100px; }  /* Checkbox */
  &.columna-nombres    { padding-left: 60px; }  /* Nombres */
  &.columna-apellidos  { padding-left: 60px; }  /* Apellidos */
  &.columna-cedula     { padding-left: 40px; }  /* Cédula */
  &.columna-correo     { padding-left: 30px; }  /* Correo */
  &.columna-estado     { padding-left: 15px; }  /* Estado */
  &.columna-sucursal   { padding-right: 70px; }   /* Sucursal */
  &.columna-usuario    { padding-right: 30px; }   /* Usuario */
`;

const CheckBoxCell = styled.td`
  text-align: center;
  padding: 14px 12px;
  padding-left: 130px; /* Aumenta este valor para mover a la derecha */
  position: relative;
`;

const DetailsContainer = styled.div`
  padding: 15px 20px 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-top: none;  // Elimina borde superior
  border-radius: 0 0 8px 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-top: 0;
`;

const ActionButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-right: ${(props) => (props.primary ? "10px" : "0")};
  color: white;
  background-color: ${(props) => (props.$primary ? "#5FB8D6" : "#da2209")};

  &:hover {
    background-color: ${(props) => (props.primary ? "#4CAAC9" : "#d9534f")};
  }
`;

const EstadoBadge = ({ estado }) => {
  const isActivo = estado === "AC";
  const backgroundColor = isActivo ? "#d4edda" : "#f8d7da";  // verde claro / rojo claro
  const textColor = isActivo ? "#155724" : "#721c24";        // verde oscuro / rojo oscuro

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "12px",
        backgroundColor,
        color: textColor,
        fontWeight: "bold",
        fontSize: "13px",
        display: "inline-block",
        minWidth: "60px",
        textAlign: "center",
        textTransform: "uppercase"
      }}
    >
      {estado}
    </span>
  );
};

const RolBadge = ({ rol }) => {
  const labelMap = {
    "AD": "Administrador del Sistema",
    "PR": "Perito",
    "RC": "Recepcionista",
    "AC": "Administrador Convenio",
    "CC": "Consultor Convenio"
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "999px",
        backgroundColor: "#D6ECFF",
        color: "#3498db",
        fontWeight: "500",
        fontSize: "14px",
        display: "inline-block",
        textAlign: "center",
        textTransform: "none"
      }}
    >
      {labelMap[rol] || rol}
    </span>
  );
};


// Componente principal
const UserTable = ({
  setEmployees,
  setFilteredEmployees,
  filteredEmployees = [], // Validación inicial: aseguramos que siempre sea un array
  selectedEmployees = [], // Validación inicial: aseguramos que siempre sea un array
  handleCheckboxChange,
  handleCrearCuenta,
  editingUser,
  setEditingUser,
}) => {
  const [sucursalesMap, setSucursalesMap] = useState({});
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Cargar sucursales al montar el componente
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const sucursales = await getBranches();
        const map = {};
        sucursales.forEach((sucursal) => {
          map[sucursal.id] = sucursal.nombre;
        });
        setSucursalesMap(map);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
      }
    };

    fetchSucursales();
  }, []);

  const handleEliminarUsuario = async (usuarioId) => {
    try {
      const resultado = await Swal.fire({
        title: '¿Eliminar cuenta de usuario?', // Texto más específico
        text: "¡Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
  
      if (resultado.isConfirmed) {
        // 1. Eliminar del backend
        await deleteUsers(usuarioId);
        
        // 2. Actualizar el estado local
        const updateEmployee = (emp) => 
          emp.cuenta_usuario?.id === usuarioId
            ? { ...emp, cuenta_usuario: null }
            : emp;
        
        setEmployees(prev => prev.map(updateEmployee));
        setFilteredEmployees(prev => prev.map(updateEmployee));
  
        // 3. Cerrar detalles si estaba abierto
        if (expandedRow === usuarioId) {
          setExpandedRow(null); // Esta es la línea clave que cierra el viewDetails
        }
  
        // 4. Mostrar confirmación
        Swal.fire(
          '¡Eliminado!',
          'La cuenta de usuario ha sido eliminada.', // Mensaje más específico
          'success'
        );
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire(
        'Error',
        error.response?.data?.message || 'No se pudo eliminar la cuenta de usuario', // Mensaje más detallado
        'error'
      );
    }
};

  /*const handleFormActualizarCuenta = async (payload) => {
    try {
      const updatedUser = await editUsers(payload.id, payload);
      
      // Actualiza estados
      setEmployees(prev => prev.map(emp => 
        emp.id === payload.id_empleado 
          ? { ...emp, cuenta_usuario: updatedUser } 
          : emp
      ));
      
      setFilteredEmployees(prev => prev.map(emp => 
        emp.id === payload.id_empleado 
          ? { ...emp, cuenta_usuario: updatedUser } 
          : emp
      ));
  
      // 1. Cierra el formulario PRIMERO
      setShowUpdateForm(false);
      
      // 2. Luego muestra el mensaje
      await Swal.fire({
        title: "¡Éxito!",
        text: "Usuario actualizado correctamente",
        icon: "success"
      });
  
    } catch (error) {
      // ... manejo de errores ...
    }
  };*/

  const handleViewDetails = (usuarioId) => {
    const usuario = filteredEmployees.find(u => u.id == usuarioId);
    if (usuario) {
      setSelectedDetails(usuario);
      setExpandedRow(expandedRow === usuarioId ? null : usuarioId);
      
      // Precarga los datos para edición si existe cuenta de usuario
      if (usuario.cuenta_usuario) {
        setEditingUser({
          ...usuario.cuenta_usuario,  // Datos de la cuenta (usuario, rol, estado)
          id_empleado: usuario.id,     // Relación con el empleado
          nombres: usuario.nombres,    // Para mostrar en el título del formulario
          apellidos: usuario.apellidos // Para mostrar en el título del formulario
        });
      } else {
        setEditingUser(null); // Limpia si no tiene cuenta
      }
    }
  };

  const handleEditingUser = () => {
    if (editingUser) {
      setShowUpdateForm(true); // Abre el formulario con datos ya cargados
    } else {
      Swal.fire({
        title: "Error",
        text: "El usuario no tiene una cuenta asignada para editar",
        icon: "error"
      });
    }
  };
  

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader style= {{paddingLeft: "175px"}}>Seleccionar</TableHeader>
            <TableHeader style= {{paddingLeft: "50px"}}>Nombres</TableHeader>
            <TableHeader style= {{paddingLeft: "60px"}}>Apellidos</TableHeader>
            <TableHeader style= {{paddingLeft: "40px"}}>Cédula</TableHeader>
            <TableHeader style= {{paddingLeft: "30px"}}>Correo</TableHeader>
            <TableHeader style= {{paddingLeft: "5px"}}>Estado</TableHeader>
            <TableHeader style= {{paddingLeft: "15px"}}>Sucursal</TableHeader>
            <TableHeader style= {{paddingLeft: "20px"}}>Usuario</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((usuario) => (
              <React.Fragment key={usuario.id}>
                <TableRow>
                  <CheckBoxCell className="columna-seleccionar">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(usuario.id)}
                      onChange={() => handleCheckboxChange(usuario.id)}
                    />
                  </CheckBoxCell>
                  
                  <TableCell className="columna-nombres">{usuario.nombres}</TableCell>
                  <TableCell className="columna-apellidos">{usuario.apellidos}</TableCell>
                  <TableCell className="columna-cedula">{usuario.cedula}</TableCell>
                  <TableCell className="columna-correo">{usuario.correo}</TableCell>
                  <TableCell className="columna-estado" style={{color: usuario.estado === "AC" ? "green" : "red", fontWeight: "bold", textTransform: "uppercase" }}>
                    {usuario.estado}
                  </TableCell>
                  <TableCell className="columna-sucursal">{sucursalesMap[usuario.id_sucursal] || "Sin asignar"}</TableCell>
                  <TableCell className="columna-usuario">
                    {usuario.cuenta_usuario ? (
                      <CustomButton 
                      bgColor={"#5A9AC6"}
                      hoverColor="#468BAF" 
                      width="100px"
                      height="35px"
                      onClick={() => handleViewDetails(usuario.id)}>
                        <Eye /> {expandedRow === usuario.id ? "Ocultar" : "Ver"}
                      </CustomButton>
                    ) : (
                      <CustomButton
                      bgColor="#20C997"  
                      hoverColor="#1E8F77"
                      width="100px"
                      height="35px"
                      onClick={() => handleCrearCuenta(usuario)}>
                        <UserPlus /> Asignar
                      </CustomButton>
                    )}
                  </TableCell>
                </TableRow>
  
                {expandedRow === usuario.id && usuario.cuenta_usuario &&(
                  <TableRow>
                    <TableCell colSpan="8">
                      <DetailsContainer>
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%',marginLeft: '130px', }}>
                          
                        <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start', 
                        width: '100%',
                        maxWidth: '1000px',
                        maxHeight: '90px' 
                      }}>
                        <h3 style={{ 
                          color: "#5FB8D6", 
                          marginBottom: '15px',
                          fontSize: '18px',
                          fontWeight: '600',
                          marginTop: '0px',

                        }}>Información de Usuario: </h3>
                        
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '15px',
                          width: '100%',
                          textAlign: 'left' // Alinea el texto a la izquierda pero mantiene el contenedor centrado
                        }}>
                          {usuario.cuenta_usuario && (
                            <>
                              <div>
                                <p><strong>Usuario:</strong> {usuario.cuenta_usuario.usuario}</p>
                              </div>
                              <div>
                                <p><strong>Estado:</strong> <EstadoBadge estado={usuario.cuenta_usuario.estado} /></p>
                              </div>
                              <div>
                                <p><strong>Rol:</strong> <RolBadge rol={usuario.cuenta_usuario.rol} /></p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                        
                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '30px', marginRight: '120px' }}>
                          <CustomButton  bgColor="#5A9AC6"
                                hoverColor="#468BAF"
                                width="170px"
                                height="35px"
                                onClick={handleEditingUser}>
                            <Pencil size={16} /> Editar Usuario
                          </CustomButton>
                          <CustomButton
                                bgColor="#FF6B6B"
                                hoverColor="#D9534F"
                                width="170px"
                                height="35px"
                                onClick={() => handleEliminarUsuario(usuario.cuenta_usuario.id)}
                              >
                                <UserMinus size={16} /> Eliminar Usuario
                              </CustomButton>
                        </div>
                      </DetailsContainer>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="8">No hay usuarios disponibles</TableCell>
            </TableRow>
            
          )}
        </tbody>
      </StyledTable>

      {showUpdateForm && (
  <UpdateForm
    showForm={showUpdateForm}
    selectedUser={editingUser}
    handleFormActualizarCuenta={async (formData) => {
      try {
        const payload = {
          id: editingUser.id,
          ...formData,
          id_empleado: editingUser.id_empleado
        };

        // 1. Actualiza en backend
        const updatedUser = await editUsers(payload.id, payload);
        
        // 2. Actualiza el estado local INMEDIATAMENTE
        const updatedData = {
          ...editingUser,
          ...formData  // Sobrescribe con los nuevos valores
        };
        setEditingUser(updatedData);

        // 3. Actualiza la lista de empleados
        setEmployees(prev => prev.map(emp => 
          emp.id === payload.id_empleado
            ? { ...emp, cuenta_usuario: updatedData }
            : emp
        ));
        
        setFilteredEmployees(prev => prev.map(emp => 
          emp.id === payload.id_empleado
            ? { ...emp, cuenta_usuario: updatedData }
            : emp
        ));

        // 4. Cierra y muestra feedback
        setShowUpdateForm(false);
        Swal.fire("¡Éxito!", "Cambios guardados", "success");
        
      } catch (error) {
        Swal.fire("Error", "No se pudieron guardar los cambios", "error");
      }
    }}
    setShowForm={setShowUpdateForm}
    onCancel={() => setShowUpdateForm(false)}
  />
)}
    </TableContainer>
  );
};

export default UserTable;