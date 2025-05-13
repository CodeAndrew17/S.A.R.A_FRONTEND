    import { useState, useEffect } from "react";
    import { getEmployees, deleteEmployees, editEmployees, addEmployees, getUsers,getBranches } from "../../../api/api_Usuarios";

    
    const useEmployeeManagement = () => {
        const [employees, setEmployees] = useState([]);
        const [filteredEmployees, setFilteredEmployees] = useState([]);
        const [selectedEmployees, setSelectedEmployees] = useState([]);
        const [expandedRow, setExpandedRow] = useState([]);
        const [sucursalesMap, setSucursalesMap] = useState({});

        useEffect(() => {
            const loadEmployeesAndUsers = async () => {
                try {
                    const empleados = await getEmployees();
                    const usuario = await getUsers();

                    const empleadosConUsuarios = empleados.map((empleado) => {
                        const usuarioAsociado = usuario.find((usuario) => usuario.id_empleado === empleado.id);
                        return { ...empleado, cuenta_usuario: usuarioAsociado || null };
                    });

                    setEmployees(empleadosConUsuarios);
                    setFilteredEmployees(empleadosConUsuarios);
                } catch (error) {
                    console.error("Error al cargar empleados:", error)
                }
            };
            loadEmployeesAndUsers();
        }, []);

        useEffect(() => {
            const loadSucursales = async () => {
                try {
                    const sucursalesData = await getBranches();
                    const map = {};
                    sucursalesData.forEach(sucursal => {
                        map[sucursal.id] = sucursal.nombre;
                    });
                    setSucursalesMap(map);
                } catch (error) {
                    console.error("Error al cargar sucursales", error);
                }
            };
            loadSucursales();
        }, []);

        const handleBuscar = (search) => {
            if (!search.trim()) {
                setFilteredEmployees(employees); 
                return;
            }
          
            
        
            const sanitizedSearch = search.trim().toLowerCase(); 
        
        
            const filtered = employees.filter((emp) => {
                const cedulaMatch = emp.cedula?.toString().includes(sanitizedSearch);
                const nombreMatch = emp.nombres?.toLowerCase().includes(sanitizedSearch);
                const sucursalMatch = emp.id_sucursal &&
                                    sucursalesMap[emp.id_sucursal]?.toLowerCase().includes(sanitizedSearch);
                const estadoMatch= emp.estado?.toLowerCase().includes(sanitizedSearch)
                return cedulaMatch || nombreMatch || sucursalMatch || estadoMatch; 
            });
        
            setFilteredEmployees(filtered); 
        };
        
        const handleEliminar = async () => {
            if (selectedEmployees.length === 0) {
                console.error("No hay empleados seleccionados");
                alert("Por favor seleccione un empleado para eliminar.");
                return;
            }

            const confirmacion = window.confirm("Está seguro que desea eliminar los usuarios seleccionados?, Esta acción no se puede deshacer");
            if (!confirmacion) return;

            try {
                for (const id of selectedEmployees) {
                    await deleteEmployees(id); //Elimina cada empleado segun ID
                }

                const empleadosActualizados = employees.filter(
                    (emp) => !selectedEmployees.includes(emp.id)
                );
                setEmployees(empleadosActualizados);
                setFilteredEmployees(empleadosActualizados);
                setSelectedEmployees([]) //Limpia los empleados seleccionados

                console.log("Empleados eliminados correctamente.");
                alert("Eliminación exitosa.");
            } catch (error) {
                console.error("Error al eliminar empleados", error);
                alert("Ocurrio un error al intentar eliminar los empleados.")
            }
        };
        
        const handleCheckboxChange = (id) => {
            setSelectedEmployees(prev => {
            const updated = prev.includes(id)
                ? prev.filter(prevId => prevId !== id)
                : [...prev, id];
            console.log("Actualizado:", updated);
            return updated;
            });
        };
        

        // En tu hook useEmployeeManagement
        const handleEditarEmpleado = async (id, updatedData) => {
            try {
            const empleadoActualizado = await editEmployees(id, updatedData);
            setEmployees(prev => 
                prev.map(emp => 
                emp.id === id ? {...emp, ...empleadoActualizado} : emp
                )
            );
            setFilteredEmployees(prev => 
                prev.map(emp => 
                emp.id === id ? {...emp, ...empleadoActualizado} : emp
                )
            );
            return true;
            } catch (error) {
            console.error("Error al editar empleado:", error);
            return false;
            }
        };

        return {
            employees,
            filteredEmployees,
            expandedRow,
            setEmployees,
            selectedEmployees,
            setFilteredEmployees,
            setSelectedEmployees,
            setExpandedRow,
            handleBuscar,
            handleEliminar,
            handleCheckboxChange,
            handleEditarEmpleado,
            sucursalesMap,
        };
    };

    export default useEmployeeManagement;