import { getEmployees, 
    deleteEmployees, 
    editEmployees, 
    addEmployees, 
    getBranches, 
    getUsers, addUsers, deleteUsers, editUsers} from '../../api/api_Usuarios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


const useEmployeeManagement = () => {
    const [employees, setEmployees] = useState([]); 
    const [branches, setBranches] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchAll = async () => {
        try {
            const [employeesData, branchesData, usersData] = await Promise.all([
                getEmployees(), //obtenemos empleado
                getBranches(),// obtenemos sucursales
                getUsers() //obtenemos usuarios todo paar armarlo en un mismo paquete
            ])

            const employeesComplete = employeesData.map(emp => {
                const branch = branchesData.find(branch => branch.id == emp.id_sucursal); 
                const user = usersData.find(user => user.id_empleado === emp.id); 
                return {
                    ...emp,
                    sucursal: branch ? branch.nombre : 'No asignada',
                    id_usuario: user ?  true : false,
                    id_usuario_real: user ?  user.id : 'No asignado',
                    nombre_usuario: user ? user.usuario : 'No asignado',
                    rol_usuario: user ? user.rol : 'No asignado',
                    estado_usuario: user ? user.estado : 'No asignado'
                }
            })    
            setEmployees(employeesComplete);
            setBranches(branchesData);
        } catch (error) {
            console.error("Error", error);
            throw error; 
        }
    };
        useEffect(() => {
            fetchAll();
        }, []);

        const createEmployee = async (newEmployeeData) => {
            try {
                const newEmployee = await addEmployees(newEmployeeData); 
                fetchAll(); //recargamos los datos para actualizar la tabla 
            } catch (error) {
                console.error("Error al crear el empleado:", error);
                throw error; 
            }
        }

        const updateEmployee = async (id, updateData) => {
            try {
                const modifyEmployees = await editEmployees(id, updateData); //enviamos tanto id del registro a actualizar como la data q se valla a actualizar
                fetchAll(); // volvemos a recurrir a la funcion para simplificar trabajod e recarga en la table
            } catch (error) {
                console.error("Error al actualizar el empleado: ", error);
                throw error;
            }
        }

        const deleteEmployee = async (ids) => {
            try {
                const idList = Array.isArray(ids) ? ids : [ids];
                const usuarios = await getUsers();
                
                // Verificar usuarios relacionados
                const usuariosRelacionados = usuarios.filter(user => idList.includes(user.id_empleado));
                
                if (usuariosRelacionados.length > 0) {
                    const confirm = await Swal.fire({
                        title: "¿Estás seguro?",
                        text: 'Este empleado tiene un usuario asignado. ¿Desea eliminar tanto el registro del empleado como el usuario vinculado?.',
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar"
                    });

                    if (!confirm.isConfirmed) return;
                }

                // Eliminar usuario y empleado
                const results = await Promise.all(
                    idList.map(async (id) => {
                        try {
                            await deleteEmployees(id);
                            // Solo eliminar usuario si existe
                            if (usuarios.some(user => user.id_empleado === id)) {
                                await deleteUsers(id);
                            }
                            return { success: true, id };
                        } catch (error) {
                            console.error(`Error al eliminar los registros para ${id}:`, error);
                            return { success: false, id, error };
                        }
                    })
                );
                
                fetchAll();
            } catch (error) {
                console.error("Error al eliminar empleado:", error);
                throw error; 
            }
        };

        const createUser = async (newUserData) => {
            try {
                const newUser = await addUsers(newUserData);
                fetchAll();
            } catch (error) {
                console.error("Error al crear nuevo usuario", error)
            }
        };

        const updateUser = async (idUser, updateDataUser) => {
            try {
                const modifyUser = await editUsers(idUser,updateDataUser );
                fetchAll(); 
            } catch (error) {
                console.log("no se pudo actualizar el empleado", error);
            }
        };

        const deleteUser = async (ids) => {
            const idList = Array.isArray(ids) ? ids : [ids];

            try {
                const results = await Promise.all(
                idList.map(async (id) => {
                    try {
                    await deleteUsers(id); 
                    return { success: true, id };
                    } catch (error) {
                    console.error(`Error eliminando usuario con ID ${id}:`, error);
                    return { success: false, id, error };
                    }
                })
                );
                fetchAll();
                return results;
            } catch (error) {
                console.error("Error general al eliminar usuarios:", error);
                throw error;
            }
        };


    return {
        employees,
        branches,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        createUser,
        updateUser,
        deleteUser
    }
}

export default useEmployeeManagement;