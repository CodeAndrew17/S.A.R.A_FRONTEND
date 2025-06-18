import Swal from 'sweetalert2';

export function handleAxiosError(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  let mensaje =
    data?.detail ||
    data?.message ||
    data?.error ||
    (typeof data === 'string' ? data : null);

  // Si no hay mensaje buscamos en objetos que contengan arrays como valores
  if (!mensaje && data && typeof data === 'object') {
    const keys = Object.keys(data);
    const erroresExtraidos = [];

    for (const key of keys) {
      const valor = data[key];
      if (Array.isArray(valor)) {
        erroresExtraidos.push(...valor);
      }
    }

    if (erroresExtraidos.length > 0) {
      mensaje = erroresExtraidos.join('\n'); 
    }
  }

  if (!mensaje) mensaje = "Ocurrió un error inesperado.";

  // Mostrar con Swal
  Swal.fire({
    icon: status === 400 ? 'warning' : 'error',
    title:
      status === 403
        ? 'Acceso denegado'
        : status === 400
        ? 'Solicitud inválida'
        : `Error ${status || ''}`,
    text: mensaje,
  });

  console.error('Error de Axios:', error);
}
