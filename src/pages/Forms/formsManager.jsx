import React, { useEffect, useState } from 'react';
import { getPlans, getForms } from '../../api/api_Admin';

const MiComponente = ({ idPlan, onFormulariosLoaded }) => {
  const [planFiltrado, setPlanFiltrado] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idPlan) {
      setError('No hay id_plan para cargar');
      return;
    }

    const fetchData = async () => {
      try {
        const allPlans = await getPlans();
        const allForms = await getForms();

        const matchedPlan = allPlans.find(plan => plan.id === Number(idPlan));
        setPlanFiltrado(matchedPlan);

        if (matchedPlan) {
          const principales = allForms.filter(form => 
            form.id_categoria && form.id_categoria.includes(matchedPlan.cuestionario)
          );

          // Asegurarse que los IDs sean números
          const adicionalesIds = (matchedPlan.lista_adicionales || []).map(id => Number(id));
          const adicionales = allForms.filter(form => adicionalesIds.includes(Number(form.id)));

          // Subo los datos al padre
          onFormulariosLoaded(principales, adicionales);
        } else {
          onFormulariosLoaded([], []);
        }
      } catch (err) {
        setError(err.message || 'Error desconocido');
        onFormulariosLoaded([], []);
      }
    };

    fetchData();
  }, [idPlan, onFormulariosLoaded]);

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!planFiltrado) return <div>Cargando plan filtrado...</div>;

  return (
    <div>
      <h2>Plan filtrado:</h2>
      <pre>{JSON.stringify(planFiltrado, null, 2)}</pre>
    </div>
  );
};

export default MiComponente;
