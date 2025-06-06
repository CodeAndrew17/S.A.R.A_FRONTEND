import React, { useEffect, useState } from 'react';
import Sidebar from "./secondSidebar";
import MiComponente from './formsManager';
import { useLocation } from 'react-router-dom';
import UserForm from '../../components/userForm';
import { getCategoryOptions, getFormItems, addAnswers } from '../../api/api_Forms';

function FormsView() {
  const [selected, setSelected] = useState(''); //estados para los seleccionados
  const [formulariosPrincipales, setFormulariosPrincipales] = useState([]); //estado para alamcenamr los formularios principales de su categoia 
  const [formulariosAdicionales, setFormulariosAdicionales] = useState([]); //estado para alamcenar los adicionales
  const [formData, setformData] = useState([]);
  const [categoriaOpciones, setCategoriaOpciones] = useState({});
  const [selectedCategoria, setSelectedCategoria] = useState({});

  const location = useLocation();
  const { id_plan, placa, plan, solicitud_id } = location.state || {}; //usamos useLocation (hook de react) lo usamos para datos desde la vista de revisiones hasta aca siun mostrarlo en la url

  const handleFormulariosLoaded = (principales, adicionales) => { //funcion q recibe los dos tanto principales como adicionales
    setFormulariosPrincipales(principales);
    setFormulariosAdicionales(adicionales);
  };

  const handleChangeCategoria = (itemId, opcionId) => {
    setSelectedCategoria(prev => ({
      ...prev,
      [itemId]: opcionId
    }));
  };

  const handleClose = () => {
    setSelected(null);
  }

  //Accede a las propiedades de la data para mostrar por cada item su nombre, y tipo
  const mappedFields = formData.map(field => {
    const idCat = field.id_items.id_categoria_opciones;
    if (idCat == "16") {
      return {
        name: `item_${field.id}`,
        label: field.id_items.nombre_items || '',
        type: 'text',
        placeholder: '',
        required: false,
        id_items: field.id_items.id
      };
    }
    if (idCat) {
      // Transforma las opciones al formato { value, label }
      const opciones = (categoriaOpciones[idCat] || []).map(opt => ({
        value: opt.id,
        label: opt.nombre_opcione
      }));
      return {
        name: `item_${field.id}`,
        label: field.id_items.nombre_items || '',
        type: 'select',
        options: opciones,
        placeholder: '',
        required: false,
        id_items: field.id_items.id
      };
    }
  });



  useEffect(() => {
    const fetchItems = async () => {
      try {
        const ids = formulariosPrincipales.map(form => form.id);
        const idsAdicionales = formulariosAdicionales.map(form => form.id);

        const results = await Promise.all([
          ...ids.map(id => getFormItems(id)), //Pasamos los id's de los formularios al backend
          ...idsAdicionales.map(id => getFormItems(id))
        ]);

      } catch (error) {
        console.error("Error al cargar los datos: ", error);
      }
    };

    if (formulariosPrincipales.length > 0) {
      fetchItems();
    }
  }, [formulariosPrincipales, formulariosAdicionales])

  //Escucha cuando selectedForm cambia
  useEffect(() => {
    const fetchFormData = async () => {
      if (!selected) return;

      try {
        const data = await getFormItems(selected.id);
        setformData(data);
      } catch (error) {
        console.error("Error al seleccionar el formulario ", error);
      }
    };
    fetchFormData();
  }, [selected])


  useEffect(() => {
    const loadOptions = async () => {
      const categorias = [
        ...new Set(
          formData.map(
            form => form.id_items.id_categoria_opciones
          ).filter(Boolean)
        )
      ];
      const nuevasOpciones = {};
      for (const id of categorias) {
        if (!categoriaOpciones[id]) {
          nuevasOpciones[id] = await getCategoryOptions(id)
        }
      }
      if (Object.keys(nuevasOpciones).length > 0) {
        setCategoriaOpciones(prev => ({ ...prev, ...nuevasOpciones }));
      }
    };
    if (formData.length > 0)
      loadOptions();
  }, [formData])


  const handleSubmitForm = async () => {
    let ArrayData = [];
    for (let item = 0; item < formData.length; item++) {
      const itemId = formData[item].id_items.id;
      const opcionId = selectedCategoria[itemId] || "";
      const idCat = formData[item].id_items.id_categoria_opciones;

      if (String(idCat) === "16") {
        ArrayData.push([itemId, opcionId]); // texto, deja como string
      } else {
        ArrayData.push([itemId, opcionId !== "" ? parseInt(opcionId, 10) : ""]); // convierte a número si no está vacío
      }
    }

    const dataToSend = {
      solicitud: solicitud_id,
      formulario: selected.id,
      resultados: ArrayData
    };

    try {
      const response = await addAnswers(dataToSend);
      console.log("Respuesta: ", response);
    } catch (error) {
      console.error("error al enviar las respuestas: ", error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        onSelect={setSelected} //el sidebar como compoennte esta listo para recibir estas props para renderizar dicha informacion (logica en el sidebar de esta carpeta (NO CONFUNDIR CON SIDEBAR PRINCIPAL))
        id_plan={id_plan} // id del plan sacado de revisones (lugar exacto en solicitudes: columnsRequest.jsx)
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
        {console.log(formData)}
        {selected && formData && (
          <UserForm
            fields={mappedFields}
            title={selected.nombre}
            onCancel={handleClose}
            onSubmit={handleSubmitForm}
            onFieldChange={handleChangeCategoria}
            selectedCategoria={selectedCategoria}
          />
        )}
      </div>
    </div>
  );
}

export default FormsView;
