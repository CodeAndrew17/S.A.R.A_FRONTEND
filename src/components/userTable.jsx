import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Eye, UserPlus } from "lucide-react";
import CustomButton from "./button";
import { deleteUsers, getBranches } from "../api/api_Usuarios";
import UpdateForm from "./Form/updateForm";
import Swal from "sweetalert2";
import useEmployeeManagement from "../hooks/useEmployeeManagement";

// Estilos generales
const TableContainer = styled.div`
  width: calc(100% - 80px); /* Espacio para el sidebar */
  margin: 20px 0 20px 80px;
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

const TableHeader = styled.th`
  background-color: #5FB8D6;
  color: white;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-size: 13px;
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

const CheckBoxCell = styled.td`
  text-align: center;
`;

const DetailsContainer = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-right: ${(props) => (props.primary ? "10px" : "0")};
  color: white;
  background-color: ${(props) => (props.primary ? "#5FB8D6" : "#da2209")};

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
  filteredEmployees = [], // Validación inicial: aseguramos que siempre sea un array
  selectedEmployees = [], // Validación inicial: aseguramos que siempre sea un array
  handleCheckboxChange,
  handleCrearCuenta,
  editingUser,
  setEditingUser,
}) => {
  const [sucursalesMap, setSucursalesMap] = useState({});
  const [selectedDetails, setSelectedDetails] = useState(null);

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

  const handleViewDetails = (usuario) => {
    console.log("Detalles del usuario seleccionado:", usuario);
    setSelectedDetails(usuario);
    setEditingUser(null); // Cierra el formulario al cambiar de usuario
  };

  const handleEditingUser = () => {
    setEditingUser(selectedDetails); // Abre el formulario del usuario seleccionado
  };

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Checkbox</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Apellido</TableHeader>
            <TableHeader>Cédula</TableHeader>
            <TableHeader>Correo</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Sucursal</TableHeader>
            <TableHeader>Acciones</TableHeader>
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
                      checked={selectedEmployees.includes((usuario.id))}
                      onChange={() => handleCheckboxChange((usuario.id))}
                    />
                  </CheckBoxCell>

                  <TableCell>{usuario.nombres}</TableCell>
                  <TableCell>{usuario.apellidos}</TableCell>
                  <TableCell>{usuario.cedula}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell style={{ color: usuario.estado === "AC" ? "green" : "red", fontWeight: "bold", textTransform: "uppercase" }}>
                    {usuario.estado}
                  </TableCell>
                  <TableCell>{sucursalesMap[usuario.id_sucursal] || "Sin asignar"}</TableCell>
                  <TableCell>
                    {usuario.cuenta_usuario ? (
                      <CustomButton onClick={() => handleViewDetails(usuario)}>
                        <Eye /> Ver
                      </CustomButton>
                    ) : (
                      <CustomButton onClick={() => handleCrearCuenta(usuario)}>
                        <UserPlus /> Asignar
                      </CustomButton>
                    )}
                  </TableCell>
                </TableRow>
                {selectedDetails?.id === usuario.id && !editingUser && (
                  <TableRow>
                    <TableCell colSpan="8">
                      <DetailsContainer style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                        {/* Columna izquierda: información de acceso */}
                        <div>
                          <h3 style={{ color: "#5FB8D6" }}>Información de acceso</h3>
                          <p><strong>Usuario:</strong> {selectedDetails.cuenta_usuario?.usuario || "No disponible"}</p>
                          <p><strong>Estado:</strong> <EstadoBadge estado={selectedDetails.estado} /></p>
                        </div>

                        {/* Columna derecha: Rol y botones */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                          <div>
                            <h3 style={{ color: "#5FB8D6", marginBottom: "5px" }}>Rol</h3>
                            <RolBadge rol={selectedDetails.cuenta_usuario?.rol} />
                          </div>
                          <div>
                            <ActionButton primary onClick={handleEditingUser}>
                              Editar Usuario
                            </ActionButton>
                            <ActionButton onClick={() => console.log("Eliminar usuario")}>
                              Eliminar Usuario
                            </ActionButton>
                          </div>
                        </div>
                      </DetailsContainer>
                    </TableCell>
                  </TableRow>
                )}
                {editingUser?.id === usuario.id && (
                  <TableRow>
                    <TableCell colSpan="8">
                      <UpdateForm
                        showForm={true}
                        selectedUser={editingUser}
                        handleFormActualizarCuenta={(formData) => console.log("Actualizar", formData)}
                        setShowForm={() => setEditingUser(null)}
                        setSelectedUser={() => { }}
                      />
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
    </TableContainer>
  );
};

export default UserTable;