import { getEmployees, 
    deleteEmployees, 
    editEmployees, 
    addEmployees, 
    getBranches, 
    getUsers, addUsers, deleteUsers, editUsers} from '../../api/api_Usuarios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { handleAxiosError } from '../../utils/alertUnauthorized';


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
            handleAxiosError(error);
        }
    };
        useEffect(() => {
            fetchAll();
        }, []);

        const createEmployee = async (newEmployeeData) => {
            try {
                const newEmployee = await addEmployees(newEmployeeData); 
                console.log("nuevo empleado creado pero desde useEmployee:", newEmployee);
                fetchAll(); //recargamos los datos para actualizar la tabla 
                return newEmployee; // devolvemos el nuevo empleado creado
            } catch (error) {
                handleAxiosError(error);
                throw error;
            }
        }

        const updateEmployee = async (id, updateData) => {
            try {
                const modifyEmployees = await editEmployees(id, updateData); //enviamos tanto id del registro a actualizar como la data q se valla a actualizar
                fetchAll(); // volvemos a recurrir a la funcion para simplificar trabajod e recarga en la table
                Swal.fire("¡Éxito!", "Empleado actualizado", "success");
            } catch (error) {
                handleAxiosError(error);
                throw error;
            }
        }

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
                    handleAxiosError(error)
                    return { success: false, id, error };
                    }
                })
                );
                fetchAll();
                return results;
            } catch (error) {
                handleAxiosError(error);
            }
        };

        const deleteEmployee = async (ids) => {
        try {
            const idList = Array.isArray(ids) ? ids : [ids];

            // confirmacion de eliminacion incial
            const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `Vas a eliminar ${idList.length} empleado(s). Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            });

            if (!result.isConfirmed) {
            await Swal.fire("Operación cancelada", "No se eliminó ningún registro.", "info");
            return; //detiene la ejecucion si no se confirma 
            }

            // verificar si los empleados seleccionados tienen usuarios vinculados 
            const usuarios = await getUsers();
            const usuariosRelacionados = usuarios.filter(user => idList.includes(user.id_empleado));

            let eliminarUsuarios = false;

            if (usuariosRelacionados.length > 0) {
            // Mostrar lista de nombres de usuarios vinculados
            const nombresUsuarios = usuariosRelacionados.map(u => u.nombres).join(", ");

            const confirmUsuarios = await Swal.fire({ //NOTA: mas adelante implementar que muestre el nombre de los empleados que tienen usuarios asignados 
                title: "Usuarios vinculados encontrados",
                text: `Los siguientes empleados tienen usuarios vinculados: ${[nombresUsuarios]}. 
        ¿Deseas eliminar también sus usuarios junto con los empleados?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar ambos",
                cancelButtonText: "Cancelar",
            });

            if (!confirmUsuarios.isConfirmed) {
                await Swal.fire("Operación cancelada", "No se eliminó ningún registro.", "info");
                return; //detiene la ejecucion si no se confirma
            }

            eliminarUsuarios = true;
            }
            

            // eliminacion en paralelo de emplados y usuarios si aplica
            await Promise.all(
            idList.map(async (id) => {
                try {
                await deleteEmployees(id);

                if (eliminarUsuarios && usuarios.some(user => user.id_empleado === id)) {
                    await deleteUsers(id);
                }
                } catch (error) {
                handleAxiosError(error);
                }
            })
            );

            fetchAll();

            await Swal.fire("Eliminado", "El/los empleado(s) fueron eliminados.", "success");
        } catch (error) {
            handleAxiosError(error);
        }
        };


        const createUser = async (newUserData) => {
            try {
                const newUser = await addUsers(newUserData);
                fetchAll();
            } catch (error) {
                handleAxiosError(error);
                throw error;
            }
        };

        const updateUser = async (idUser, updateDataUser) => {
            try {
                const modifyUser = await editUsers(idUser,updateDataUser );
                fetchAll(); 
                Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success");
            } catch (error) {
                handleAxiosError(error);
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