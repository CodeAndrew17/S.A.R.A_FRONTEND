import React, { useState } from 'react';
import Sidebar from "./secondSidebar"; 
import MiComponente from './formsManager';
import { useLocation } from 'react-router-dom';

function FormsView() {
  const [selected, setSelected] = useState(''); //estados para los seleccionados
  const [formulariosPrincipales, setFormulariosPrincipales] = useState([]); //estado para alamcenamr los formularios principales de su categoia 
  const [formulariosAdicionales, setFormulariosAdicionales] = useState([]); //estado para alamcenar los adicionales

  const location = useLocation();
  const { id_plan, placa, plan } = location.state || {}; //usamos useLocation (hook de react) lo usamos para datos desde la vista de revisiones hasta aca siun mostrarlo en la url

  const handleFormulariosLoaded = (principales, adicionales) => { //funcion q recibe los dos tanto principales como adicionales
    setFormulariosPrincipales(principales);
    setFormulariosAdicionales(adicionales);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        onSelect={setSelected} //el sidebar como compoennte esta listo para recibir estas props para renderizar dicha informacion (logica en el sidebar de esta carpeta (NO CONFUNDIR CON SIDEBAR PRINCIPAL))
        id_plan={id_plan} // ide del plan sacado de revisones (lugar exacto en solicitudes: columnsRequest.jsx)
        placa={placa} // tambien lo traemos de solicitudes
        plan={plan} //tambien lo traemos de alli para mostrar la informacion
        formulariosPrincipales={formulariosPrincipales} // formularios principales 
        formulariosAdicionales={formulariosAdicionales} // formularios adicionales (separacion clara de los dos )
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
