import Swal from 'sweetalert2';

export function handleAxiosError(error) {
  const status = error?.response?.status;
  let data = error?.response?.data;

  // Si viene como string, se conveierte a objeto
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // no se pudo parsear
    }
  }

  let mensaje =
    data?.detail ||
    data?.message ||
    data?.error ||
    (typeof data === 'string' ? data : null);


  // Verifica si hay una propiedad llamada 'errors' con más detalles
  if (!mensaje && data && typeof data === 'object') {
    const errores = data.errors || data; // puede que vengan directamente en data o en data.errors
    const erroresExtraidos = [];

    for (const key in errores) {
      const valor = errores[key];
      if (Array.isArray(valor)) {
        erroresExtraidos.push(`${key}: ${valor.join(', ')}`);
      } else if (typeof valor === 'string') {
        erroresExtraidos.push(`${key}: ${valor}`);
      }
    }

    if (erroresExtraidos.length > 0) {
      mensaje = erroresExtraidos.join('\n');
    }
  }

  if (!mensaje) mensaje = "Ocurrió un error inesperado.";

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
