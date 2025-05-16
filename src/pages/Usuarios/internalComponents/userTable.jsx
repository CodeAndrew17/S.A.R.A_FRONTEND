import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Eye, UserPlus, Pencil, UserMinus } from "lucide-react";
import CustomButton from "../../../components/button";
import { deleteUsers, getBranches } from "../../../api/api_Usuarios";
import UpdateForm from "../Forms/updateForm";
import Swal from "sweetalert2";
import { editUsers } from "../../../api/api_Usuarios";

// Estilos generales
const TableContainer = styled.div`
  width: 100%;
  margin: 30px 0;
  background-color: #fff;
  padding: 20px 0 0 0;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto; /* Scroll horizontal */
  -webkit-overflow-scrolling: touch; /* Scroll suave en iOS */
  margin-top: -20px;
  margin-bottom: 0;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    height: 10px; 
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
    margin: 0 20px;
  }
  &::-webkit-scrollbar-thumb {
    background: #5FB8D6;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #4a9db8;
  }

  @media (max-width: 1024px) {
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    margin: 15px 0;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 1200px; 
  table-layout: auto;
  border-collapse: collapse;


  @media (max-width: 1024px) and (min-width: 768px) {
    min-width: 1100px; /* Ancho que garantiza scroll en 768px */
  }

  @media (max-width: 767px) {
    min-width: 900px; 
  }
`;

const TableHeader = styled.th`
  background-color: #5FB8D6;
  color: white;
  padding: 16px 12px;
  text-align: left;
  font-size: 15px;
  border-bottom: 2px solid #ddd;

  @media (max-width: 1024px) {
    padding: 12px 8px;
    font-size: 14px;
  }
`;

const TableRow = styled.tr`
  &:last-child {
    td {
      border-bottom: 1px solid #e0e0e0;
    }
  }
`;

const TableCell = styled.td`
  padding: 14px 12px;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1024px) {
    padding: 12px 8px;
    font-size: 13px;
  }

  &.columna-seleccionar { padding-left: 50px; }
  &.columna-nombres { padding-left: 60px; }
  &.columna-apellidos { padding-left: 60px; }
  &.columna-cedula { padding-left: 40px; }
  &.columna-correo { padding-left: 30px; }
  &.columna-estado { padding-left: 15px; }
  &.columna-sucursal { padding-right: 45px; }
  &.columna-usuario { padding-right: 30px; }

  @media (max-width: 768px) {
    &.columna-seleccionar { padding-left: 30px; }
    &.columna-nombres { padding-left: 40px; }
    &.columna-apellidos { padding-left: 40px; }
    &.columna-cedula { padding-left: 30px; }
    &.columna-correo { padding-left: 20px; }
  }
`;

const CheckBoxCell = styled.td`
  text-align: center;
  padding: 14px 12px;
  padding-left: 110px;
  position: relative;

  @media (max-width: 1024px) {
    padding-left: 90px;
  }

  @media (max-width: 768px) {
    padding-left: 70px;
  }
`;

const DetailsContainer = styled.div`
  padding: 15px 20px 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-top: 0;

  @media (max-width: 768px) {
    padding: 12px 15px;
  }
`;

const CenteredCell = styled(TableCell)`
  text-align: center;
  color: #ff0000;
  font-weight: bold;
`;

const ResponsiveDiv = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  margin-right: 120px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    margin-right: 0;
    align-items: center;
  }
`;

const ResponsiveFlex = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-left: 130px;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const EstadoBadge = ({ estado }) => {
  const isActivo = estado === "AC";
  const backgroundColor = isActivo ? "#d4edda" : "#f8d7da"; 
  const textColor = isActivo ? "#155724" : "#721c24";        

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
    "AD": "Administrador",
    "PR": "Perito",
    "RC": "Recepcionista",
    "AC": "Admin Convenio",
    "CC": "Consultor"
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
  filteredEmployees = [],
  selectedEmployees = [],
  handleCheckboxChange,
  handleCrearCuenta,
  editingUser,
  setEditingUser,
}) => {
  const [sucursalesMap, setSucursalesMap] = useState({});
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

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
        title: '¿Eliminar cuenta de usuario?',
        text: "¡Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
  
      if (resultado.isConfirmed) {
        await deleteUsers(usuarioId);
        
        const updateEmployee = (emp) => 
          emp.cuenta_usuario?.id === usuarioId
            ? { ...emp, cuenta_usuario: null }
            : emp;
        
        setEmployees(prev => prev.map(updateEmployee));
        setFilteredEmployees(prev => prev.map(updateEmployee));
  
        if (expandedRow === usuarioId) {
          setExpandedRow(null);
        }
  
        Swal.fire(
          '¡Eliminado!',
          'La cuenta de usuario ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire(
        'Error',
        error.response?.data?.message || 'No se pudo eliminar la cuenta de usuario',
        'error'
      );
    }
  };

  const handleViewDetails = (usuarioId) => {
    const usuario = filteredEmployees.find(u => u.id == usuarioId);

    console.log('Usuario:', usuario);
    console.log('expandedRow:', expandedRow);
    if (usuario) {
      setSelectedDetails(usuario);
      setExpandedRow(expandedRow === usuarioId ? null : usuarioId);
      
      if (usuario.cuenta_usuario) {
        setEditingUser({
          ...usuario.cuenta_usuario,  
          id_empleado: usuario.id,     
          nombres: usuario.nombres,    
          apellidos: usuario.apellidos 
        });
      } else {
        setEditingUser(null);
      }
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

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader style={{paddingLeft: "165px"}}>Seleccionar</TableHeader>
            <TableHeader style={{paddingLeft: "60px"}}>Nombres</TableHeader>
            <TableHeader style={{paddingLeft: "60px"}}>Apellidos</TableHeader>
            <TableHeader style={{paddingLeft: "38px"}}>Cédula</TableHeader>
            <TableHeader style={{paddingLeft: "28px"}}>Correo</TableHeader>
            <TableHeader style={{paddingLeft: "2px"}}>Estado</TableHeader>
            <TableHeader style={{paddingLeft: "15px"}}>Sucursal</TableHeader>
            <TableHeader style={{paddingLeft: "25px"}}>Usuario</TableHeader>
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
                        <Eye size={16} /> {expandedRow === usuario.id ? "Ocultar" : "Ver"}
                      </CustomButton>
                    ) : (
                      <CustomButton
                        bgColor="#20C997"  
                        hoverColor="#1E8F77"
                        width="100px"
                        height="35px"
                        onClick={() => handleCrearCuenta(usuario)}>
                        <UserPlus size={16} /> Asignar
                      </CustomButton>
                    )}
                  </TableCell>
                </TableRow>
  
                {expandedRow === usuario.id && usuario.cuenta_usuario &&(
                  <TableRow>
                    <TableCell colSpan="8">
                      <DetailsContainer>
                      <ResponsiveFlex>
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
                              textAlign: 'left'
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
                        </ResponsiveFlex>
                        
                        <ResponsiveDiv>
                          <CustomButton  
                            bgColor="#5A9AC6"
                            hoverColor="#468BAF"
                            width="170px"
                            height="35px"
                            responsiveWidth="150px"
                            onClick={handleEditingUser}>
                            <Pencil size={16} /> Editar Usuario
                          </CustomButton>
                          <CustomButton
                            bgColor="#FF6B6B"
                            hoverColor="#D9534F"
                            width="170px"
                            height="35px"
                            responsiveWidth="150px"
                            onClick={() => handleEliminarUsuario(usuario.cuenta_usuario.id)}
                          >
                            <UserMinus size={16} /> Eliminar Usuario
                          </CustomButton>
                          </ResponsiveDiv>
                      </DetailsContainer>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <CenteredCell colSpan="8">
                Usuario no encontrado
              </CenteredCell>
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

              const updatedUser = await editUsers(payload.id, payload);
              
              const updatedData = {
                ...editingUser,
                ...formData
              };
              setEditingUser(updatedData);

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