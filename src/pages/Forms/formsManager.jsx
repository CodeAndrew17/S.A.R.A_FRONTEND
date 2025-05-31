import React, { useEffect, useState } from 'react';
import { getPlans, getForms } from '../../api/api_Admin';

const MiComponente = ({ idPlan, onFormulariosLoaded }) => {
  const [planFiltrado, setPlanFiltrado] = useState(null); //para los planes 
  const [error, setError] = useState(null); //errores

  useEffect(() => {
    if (!idPlan) {
      setError('No hay id_plan para cargar'); //en caso de q no se porporcione
      return;
    }

    const fetchData = async () => { //obtenemos planes y formularios
      try {
        const allPlans = await getPlans();
        const allForms = await getForms();

        const matchedPlan = allPlans.find(plan => plan.id === Number(idPlan)); //cojemos todos los planes y filtramos dinamicamente por el pla id 
        setPlanFiltrado(matchedPlan); //pasamos el plan filtrado al state

        if (matchedPlan) { //si el plan buscado existe buscamos los formularios principales de ese plan tipo avaluo o inspeccion
          const principales = allForms.filter(form => 
            form.id_categoria && form.id_categoria.includes(matchedPlan.cuestionario)
          );

          const adicionalesIds = (matchedPlan.lista_adicionales || []).map(id => Number(id)); //mapeamos los id de los formularios adicionales
          const adicionales = allForms.filter(form => adicionalesIds.includes(Number(form.id))); //filtramos los formularios adicionales por id

          onFormulariosLoaded(principales, adicionales); //pasamos parametros al state
        } else {
          onFormulariosLoaded([], []);
        }
      } catch (err) {
        setError(err.message || 'Error desconocido');
        onFormulariosLoaded([], []); //asignamos arrays vacios en caso de no encontrar nada 
      } 
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPlan]); // Solo idPlan en las dependencias

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!planFiltrado) return <div>Cargando plan filtrado...</div>; //muestra el plan filtrado y lo renderiza en el return (depuracion)

  return (
    <div>
      <h2>Plan filtrado:</h2>
      <pre>{JSON.stringify(planFiltrado, null, 2)}</pre>
    </div>
  );
};

export default MiComponente;
