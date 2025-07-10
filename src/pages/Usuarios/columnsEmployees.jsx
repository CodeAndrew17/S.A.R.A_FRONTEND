import CustomButton from '../../components/button';
import useEmployeeManagement from './useEmployeeManagement';
import { Eye, UserPlus, Pencil, UserMinus } from "lucide-react";

export const columnsEmployees = (handleToggleExpand, expandedRow, handleAssignClick) => {
    const { employees } = useEmployeeManagement();

    const columns = [
        { key: "nombres", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Nombres</span> },
        { key: "apellidos", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Apellidos</span> },
        { key: "cedula", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Cédula</span> },
        { key: "correo", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Correo</span> },
        { key: "estado", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Estado</span> },
        { key: "sucursal", title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Sucursal</span> },
        {
            key: "acciones",
            title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Acciones</span>,
            render: (value, row) => (
                row.id_usuario ? (
                    <CustomButton 
                        bgColor={"#4F98D3"}
                        hoverColor="#3E86C2" 
                        width="100px"
                        height="35px"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(row.id);
                        }}
                    >
                        <Eye size={16} /> 
                        {expandedRow === row.id ? "Ocultar" : "Ver"}
                    </CustomButton>
                ) : (
                    <CustomButton
                        bgColor="#27D3A3"  
                        hoverColor="#1CA187"
                        width="100px"
                        height="35px"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAssignClick(row);
                        }}>
                        <UserPlus size={16} /> Asignar
                    </CustomButton>
                )
            )
        }
    ];
    
    return columns;
};