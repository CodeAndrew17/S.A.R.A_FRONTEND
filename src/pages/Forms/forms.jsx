import React, { useEffect, useState } from 'react';
import Sidebar from "./secondSidebar";
import MiComponente from './formsManager';
import { useLocation } from 'react-router-dom';
import UserForm from '../../components/Form_UserForm';
import { getCategoryOptions, getFormItems, addAnswers, getAnswers } from '../../api/api_Forms';
import CustomButton from '../../components/button';
import { useNavigate } from 'react-router-dom';
import { Undo2, CheckCircle } from 'lucide-react';
import GlassCard from "../../components/glassCard";
import Swal from 'sweetalert2';
import UploadImageForm from "../../components/imageForm";


function FormsView() {
  const [selected, setSelected] = useState(null);
  const [formulariosPrincipales, setFormulariosPrincipales] = useState([]);
  const [formulariosAdicionales, setFormulariosAdicionales] = useState([]);
  const [formData, setformData] = useState([]);
  const [categoriaOpciones, setCategoriaOpciones] = useState({});
  const [selectedCategoria, setSelectedCategoria] = useState({});
  const navigate = useNavigate();
  const [mostrarAlerta, setMostrarAlerta] = useState(true);
  const [planFiltrado, setPlanFiltrado] = useState(null);
  const [conteoPrincipales, setConteoPrincipales] = useState(0);
  const [conteoAdicionales, setConteoAdicionales] = useState(0);

  const location = useLocation();
  const { id_plan, placa, plan, solicitud_id, observaciones, sucursal, convenio } = location.state || {};
  const observacionesPlan = observaciones;

  // Recibe los formularios principales y adicionales desde MiComponente
  const handleFormulariosLoaded = (principales, adicionales, plan) => {
    setFormulariosPrincipales(principales);
    setFormulariosAdicionales(adicionales);
    setPlanFiltrado(plan);
  };

  // Cambia la opción seleccionada de un campo
  const handleChangeCategoria = (itemId, opcionId) => {
    setSelectedCategoria(prev => ({
      ...prev,
      [itemId]: opcionId
    }));
  };

  // Cierra el formulario seleccionado
  const handleClose = () => {
    setSelected(null);
  };

  // Mapea los campos del formulario para UserForm
  const mappedFields = formData
    .map(field => {
      const idCat = field.id_items.id_categoria_opciones;
      const fieldType = field.id_items.tipo;

      // Si es categoría 16, maneja todos los tipos posibles aquí
      if (String(idCat) === "16") {
        if (fieldType === "FEC") {
          return {
            name: `item_${field.id}`,
            label: field.id_items.nombre_items || '',
            type: 'date',
            placeholder: '',
            required: false,
            id_items: field.id_items.id
          };
        } else if (fieldType === "INT") {
          return {
            name: `item_${field.id}`,
            label: field.id_items.nombre_items || '',
            type: 'number',
            placeholder: '',
            required: false,
            id_items: field.id_items.id
          };
        } else if (fieldType === "STR") {
          return {
            name: `item_${field.id}`,
            label: field.id_items.nombre_items || '',
            type: 'text',
            placeholder: '',
            required: false,
            id_items: field.id_items.id
          };
        }
        // Si hay otros tipos para idCat 16, agrégalos aquí
        return null;
      }

      // Para otros idCat, si es STR, text; si tiene opciones, select
      if (fieldType === "STR") {
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
        const opciones = (categoriaOpciones[idCat] || []).map(opt => ({
          value: opt.id,
          label: opt.nombre_opcion
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

      return null;
    })
    .filter(Boolean);

  // Carga los items del formulario seleccionado
  useEffect(() => {
    const fetchFormData = async () => {
      if (!selected) {
        setformData([]);
        return;
      }
      try {
        const data = await getFormItems(selected.id);
        setformData(data);
      } catch (error) {
        console.error("Error al seleccionar el formulario ", error);
      }
    };
    fetchFormData();
  }, [selected]);

  // Carga las opciones de los selects según los items del formulario
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
          nuevasOpciones[id] = await getCategoryOptions(id);
        }
      }
      if (Object.keys(nuevasOpciones).length > 0) {
        setCategoriaOpciones(prev => ({ ...prev, ...nuevasOpciones }));
      }
    };
    if (formData.length > 0) loadOptions();
    // eslint-disable-next-line
  }, [formData]);


  // effect para traer la repsuestas seleccionadas del formulario selected
  useEffect(() => {
    if (!selected || !selected.id || !solicitud_id) return; //si ninguna de las condiciones se cumple no hacemos nada 
    //hacemos el fetch de las respuestas con los datos necesarios del get 
    const fetchRespuestasPrevias = async () => {
      try{
        const data = await getAnswers(solicitud_id, selected.id);

        const respuestasMap = {}; //inicializamos el objeto para las respuestas

        data.forEach(respuesta => { //hacemos un for para recorrer las respuestas si es textos se usa ese valor si no se usa la opcion 
          respuestasMap[`item_${respuesta.id_item}`] = 
          respuesta.respuesta_texto !== null
          ? respuesta.respuesta_texto :
          respuesta.id_opcion
        });

        setSelectedCategoria(respuestasMap); //actualizamos el estado de selectedCategoria con repsuestas previas getAnswers

      } catch (error) {
        console.error("Error al cargar las respuestas previas: ", error);
      }
    };

    fetchRespuestasPrevias();
  }, [selected,solicitud_id]);

  // Maneja el envío del formulario
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

      setSelected(null);

      await Swal.fire({
        title: 'Respuestas enviadas',
        text: 'Las respuestas se registraron correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })

    } catch (error) {
      //console.error("Error al enviar las respuestas: ", error);
      await Swal.fire({
        title: 'Error al enviar respuestas',
        text: 'Hubo un error al enviar las respuestas. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    }
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
        onContarFormularios={(principales, adicionales) => {
          setConteoPrincipales(principales);
          setConteoAdicionales(adicionales);
        }}
      />

      <div style={{ marginLeft: '240px', padding: '2rem', flex: 1 }}>
        {planFiltrado && (
          <GlassCard>
            <h2>Descripción del plan:</h2>
            <p><strong>Nombre del plan:</strong> {planFiltrado.nombre_plan}</p>
            <p><strong>Cuestionario:</strong> {planFiltrado.cuestionario}</p>
            <p><strong>Tipo de vehiculo:</strong> {planFiltrado.id_tipo_vehiculo}</p>
            <p><strong>Formularios principales:</strong> {conteoPrincipales}</p>
            <p><strong>Formularios adicionales:</strong> {conteoAdicionales}</p>
            <h2>Descripción de la solicitud:</h2>
            <p><strong>Observaciones:</strong> {observacionesPlan || "No hay observaciones registradas"}</p>
            <p><strong>Placa:</strong> {placa}</p>
            <p><strong>Convenio:</strong> {convenio}</p>
            <p><strong>Sucursal:</strong> {sucursal}</p>
          </GlassCard>
        )}

        <GlassCard>
          <UploadImageForm
            endpoint={`/request/api/solicitud/upload/${solicitud_id}/`}></UploadImageForm>
        </GlassCard>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
          <CustomButton
            width={"110px"}
            bgColor={"#5FB8D6"}
            hoverColor={"#48A2BF"}
            onClick={() => navigate("/revisiones")}
          >
            <Undo2 />Volver
          </CustomButton>
          <CustomButton
            width={"110px"}
            bgColor={"#5FB8D6"}
            hoverColor={"#48A2BF"}
            onClick={() => console.log("finalizar")}
          >
            <CheckCircle />Finalizar
          </CustomButton>
        </div>

        <MiComponente idPlan={id_plan} onFormulariosLoaded={handleFormulariosLoaded} />

        {selected === 'usuarios' && <div>Formulario de usuarios</div>}
        {selected === 'formularios' && <div>Formulario general</div>}
        {selected === 'solicitudes' && <div>Formulario de solicitudes</div>}
        {selected?.id && mappedFields.length > 0 && (
        <UserForm
          fields={mappedFields}
          title={selected.nombre}
          onCancel={handleClose}
          onSubmit={handleSubmitForm}
          onFieldChange={handleChangeCategoria}
          initialValues={selectedCategoria} //pasamos las respuestas previas ya recorridas y asignadas correctamente 
        />
        )}
      </div>
    </div>
  );
}

export default FormsView;