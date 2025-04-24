import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Eye, UserPlus, Pencil, UserMinus } from "lucide-react";
import CustomButton from "../../../components/button";
import { deleteUsers, getBranches, editUsers } from "../../../api/api_Usuarios";
import UpdateForm from "../Forms/updateForm";
import Swal from "sweetalert2";

// Estilos
const TableContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  min-width: 700px;
`;

const TableHeader = styled.th`
  background-color: #5FB8D6;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
  font-size: 14px;

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  white-space: normal;
  word-wrap: break-word;
  font-size: 14px;

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`;

const CheckBoxCell = styled.td`
  text-align: center;
  padding: 12px 15px;

  @media (max-width: 768px) {
    padding: 8px 10px;
  }
`;

const EstadoBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ estado }) => estado === 'AC' ? '#d4edda' : '#f8d7da'};
  color: ${({ estado }) => estado === 'AC' ? '#155724' : '#721c24'};
`;

const DetailsContainer = styled.div`
  padding: 15px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 15px;

  @media (max-width: 768px) {
    padding: 10px;
    flex-direction: column;
  }
`;

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
        cancelButtonText: 'Cancelar',
      });

      if (resultado.isConfirmed) {
        await deleteUsers(usuarioId);
        setEmployees((prev) => prev.filter((emp) => emp.cuenta_usuario?.id !== usuarioId));
        setFilteredEmployees((prev) => prev.filter((emp) => emp.cuenta_usuario?.id !== usuarioId));
        Swal.fire('¡Eliminado!', 'La cuenta de usuario ha sido eliminada.', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la cuenta de usuario', 'error');
    }
  };

  const handleViewDetails = (usuarioId) => {
    const usuario = filteredEmployees.find((u) => u.id === usuarioId);
    if (usuario) {
      setExpandedRow(expandedRow === usuarioId ? null : usuarioId);
      setEditingUser(usuario.cuenta_usuario ? { ...usuario.cuenta_usuario, id_empleado: usuario.id } : null);
    }
  };

  const handleEditingUser = () => {
    if (editingUser) {
      setShowUpdateForm(true);
    } else {
      Swal.fire({ title: "Error", text: "El usuario no tiene una cuenta asignada para editar", icon: "error" });
    }
  };

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Seleccionar</TableHeader>
            <TableHeader>Nombres</TableHeader>
            <TableHeader>Apellidos</TableHeader>
            <TableHeader>Cédula</TableHeader>
            <TableHeader>Correo</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Sucursal</TableHeader>
            <TableHeader>Usuario</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((usuario) => (
              <React.Fragment key={usuario.id}>
                <TableRow>
                  <CheckBoxCell>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(usuario.id)}
                      onChange={() => handleCheckboxChange(usuario.id)}
                    />
                  </CheckBoxCell>
                  <TableCell>{usuario.nombres}</TableCell>
                  <TableCell>{usuario.apellidos}</TableCell>
                  <TableCell>{usuario.cedula}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell style={{ color: usuario.estado === 'AC' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {usuario.estado}
                  </TableCell>
                  <TableCell>{sucursalesMap[usuario.id_sucursal] || 'Sin asignar'}</TableCell>
                  <TableCell>
                    {usuario.cuenta_usuario ? (
                      <CustomButton bgColor={"#5A9AC6"} hoverColor="#468BAF" width="100px" height="35px" onClick={() => handleViewDetails(usuario.id)}>
                        <Eye /> {expandedRow === usuario.id ? "Ocultar" : "Ver"}
                      </CustomButton>
                    ) : (
                      <CustomButton bgColor="#20C997" hoverColor="#1E8F77" width="100px" height="35px" onClick={() => handleCrearCuenta(usuario)}>
                        <UserPlus /> Asignar
                      </CustomButton>
                    )}
                  </TableCell>
                </TableRow>

                {expandedRow === usuario.id && usuario.cuenta_usuario && (
                  <TableRow>
                    <TableCell colSpan="8">
                      <DetailsContainer>
                        <div>
                          <h3>Información de Usuario:</h3>
                          <p><strong>Usuario:</strong> {usuario.cuenta_usuario.usuario}</p>
                          <p><strong>Estado:</strong> <EstadoBadge estado={usuario.cuenta_usuario.estado}>{usuario.cuenta_usuario.estado}</EstadoBadge></p>
                          <p><strong>Rol:</strong> {usuario.cuenta_usuario.rol}</p>
                        </div>
                        <div>
                          <CustomButton bgColor="#5A9AC6" hoverColor="#468BAF" onClick={handleEditingUser}>
                            <Pencil size={16} /> Editar Usuario
                          </CustomButton>
                          <CustomButton bgColor="#FF6B6B" hoverColor="#D9534F" onClick={() => handleEliminarUsuario(usuario.cuenta_usuario.id)}>
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
              <TableCell colSpan="8" style={{ textAlign: 'center' }}>Usuario no encontrado</TableCell>
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
              const updatedUser = await editUsers(editingUser.id, formData);
              setEditingUser(updatedUser);
              setEmployees((prev) => prev.map((emp) => (emp.id === updatedUser.id ? updatedUser : emp)));
              setFilteredEmployees((prev) => prev.map((emp) => (emp.id === updatedUser.id ? updatedUser : emp)));
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
