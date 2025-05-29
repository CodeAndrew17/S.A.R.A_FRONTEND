import React, { useState } from 'react';
import Sidebar from "./secondSidebar"; 
import MiComponente from './formsManager';
import { useLocation } from 'react-router-dom';

function FormsView() {
  const [selected, setSelected] = useState('');
  const [formulariosPrincipales, setFormulariosPrincipales] = useState([]);
  const [formulariosAdicionales, setFormulariosAdicionales] = useState([]);

  const location = useLocation();
  const { id_plan, placa, plan } = location.state || {};

  const handleFormulariosLoaded = (principales, adicionales) => {
    setFormulariosPrincipales(principales);
    setFormulariosAdicionales(adicionales);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        onSelect={setSelected}
        id_plan={id_plan}
        placa={placa}
        plan={plan}
        formulariosPrincipales={formulariosPrincipales}
        formulariosAdicionales={formulariosAdicionales}
      />

      <div style={{ marginLeft: '240px', padding: '2rem', flex: 1 }}>
        {/* Le paso id_plan directamente */}
        <MiComponente idPlan={id_plan} onFormulariosLoaded={handleFormulariosLoaded} />

        {selected === 'usuarios' && <div>Formulario de usuarios</div>}
        {selected === 'formularios' && <div>Formulario general</div>}
        {selected === 'solicitudes' && <div>Formulario de solicitudes</div>}
      </div>
    </div>
  );
}

export default FormsView;
