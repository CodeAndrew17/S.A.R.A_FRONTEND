import axios from 'axios';

// const API_URL = "http://192.168.1.24:8000";  // IP de tu PC (servidor Django) sirve para celular samsung y redmi 

// const API_URL = "http://192.168.1.24:8000";  // vista local movil samsung
//const API_URL = 'http://127.0.0.1:8000'; //vista dev pc

const API_URL = `https://api-662551806039.us-east1.run.app`;

// Función de login para obtener el token de access
const login = async (usuario, password) => {
    try {
        //se realiza solicitud post al endpoind
        const response = await axios.post(`${API_URL}/access/api/login/`, { usuario, password });
        const { access, refresh }= response.data;

        //Guardamos ambos tokens en sessionstorage
        sessionStorage.setItem('access',access);
        sessionStorage.setItem('refresh',refresh);

        return response.data;  
    }catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            //Lista para los errores
            const errorMessages = {
                400: "Usuario y contraseña son requeridos.",
                401: "Contraseña incorrecta.",
                403: "Usuario inactivo o no encontrado. Contacta al administrador.",
                500: "Error interno del servidor. Inténtalo más tarde."
            };

            //Crea el nuevo mensaje y valida el status correspodiente 
            throw new Error(errorMessages[status] || data.error || "Error desconocido.");

        } else if (error.request) {

            throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");

        } else {
            
            throw new Error('Error de conexión');
        }
    }
};

// Funcion para renovar los nuevos tokens de access y refresh
const refreshToken = async () => {
    const refresh = sessionStorage.getItem('refresh');

    if (!refresh) {
        throw new Error('No se encontró token de refresh');
    }

    try {
        const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh }); // Cambiado a backticks
        const { access, refresh: newRefresh } = response.data;

        // Actualizamos el token de acceso en sessionStorage
        sessionStorage.setItem('access', access);
        if (newRefresh !== undefined) {
            sessionStorage.setItem('refresh', newRefresh);
        }

        return access;
    } catch (error) {
        if (error.response) {
            throw new Error('No se pudo refrescar el token. Inicia sesión nuevamente.');
        } else {
            throw new Error('Error de conexión al servidor.');
        }
    }
};

//Funcion para decodificar el token y saber el tiempo de expiracion interno del token de acceso
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1]; //se extrae la parte del payload 
        const base64 = base64Url.replace(/-/g,'+').replace(/_/g,'/');
        return JSON.parse(atob(base64));
    } catch (error) {
        return null; //retorna null si el token no es valido 
    }
};

//Funcion para verificar si el token ya esta por expirar
const isTokenExpired = (token) => {
    const decoded = decodeToken(token);

    if (!decoded|| !decoded.exp) {
        return true; //si el token no tiene fecha de expiracion los consideramos invalido 
    }

    const currentTime = Math.floor(Date.now() / 1000); //Tiempo actual en segundos 
    return decoded.exp - currentTime < 60; // si faltan menos de 60s lo consideramos invalido para dar margen de tiempo a la solicitud de refresh
};

//Funcion para hacer solicitudes con autenticación (esta se usa en las peticiones a enpoinds protegidos para garantizar q el token access siempre sea valido)
const axiosWithAuth = async (url, method = 'GET', body = null) => {
    //Recuperamos el token de acceso almacenado en localStorage
    let token = sessionStorage.getItem('access');

    if (!token || isTokenExpired(token)) {
        try{
            token = await refreshToken(); //renovamos el token antes de la peticion 
        } catch (error) {
            throw new Error('Sesion expirada. Inicia sesion nuevamente.'); // si no se puede renovar el token 
        }
    }

    try {
        const isFormData = body instanceof FormData; //verificamos si el cuerpo es un formdata 
        //Configuramos la solicitud con los parametros necesarios
        const config = {
            method: method,
            url: `${API_URL}${url}`, //Concatenamos la url para armarla
            headers: {
                'Authorization' : `Bearer ${token}`,
                ...(isFormData ? {} : { 'Content-Type' : 'application/json'})
            },
            data: body ? body : null,  // Enviamos el cuerpo si tiene
        };

        const response = await axios(config);
        return response.data;
    }catch (error) {
        if(error.response && error.response.status === 401) {
            console.warn('Sesion expirada. Redirigiendo al login...');
            logout();
            return;
        }
        throw error;
    }
};

    //funcion especial para descargar los archivos para ello se arma el cuerpo o payload de manera distinta a las demas peticiones 
    const axiosWithAuthFile = async (url, method = "GET", body = null) => {
    let token = sessionStorage.getItem("access");

    // renovar token si hace falta
    if (!token || isTokenExpired(token)) {
        try {
        token = await refreshToken();
        } catch (err) {
        throw new Error("Sesión expirada. Inicia sesión nuevamente.");
        }
    }

    try {
        const config = {
        method,
        url: `${API_URL}${url}`,
        headers: {
            Authorization: `Bearer ${token}`,
            // no ponemos Content-Type porque no lo necesitamos para descargar
        },
        responseType: "blob", //lo importante para archivos binarios
        data: body ? body : null, // NOTA: q es blob? binary large object tipo de objeto especial en js ideal para los archivos pdf excel etc 
        };

        const response = await axios(config);
        return response; // devolvemos la respuesta completa (response.data sera el Blob)
    } catch (error) {
        if (error.response && error.response.status === 401) {
        logout();
        return;
        }
        throw error;
    }
    };


//Funcion para solictar restablecer contraseña mediante correo electronico 
const solicitarPassword = async (usuario,correo) => {
    try {
        const response = await axios.post(`${API_URL}/access/api/solicitarpassword/`, { //endpoind para enviar el correo
            usuario,
            correo,  //cuerpo de la solicitud en formato json
        });
        return response.data; 
    } catch (error) {
        console.error("Error al solicitar restablecer contraseña:", error);
        throw error.response?.data?.detail || 'Error al solicitar restablecer contraseña';
    }
};

const resetPassword = async (tokenOne, tokenTwo, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/access/api/restablecerpassword/${tokenOne}/${tokenTwo}/`, newPassword)
    } catch (error) {
        console.error("error al enviar los datos en el reestablecimiento de password")
        throw error; 
    }
}

const logout = () => {
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    sessionStorage.removeItem("username");

    window.location.href = "/";


}

export { login, axiosWithAuth, refreshToken, solicitarPassword, logout, axiosWithAuthFile, API_URL, resetPassword};