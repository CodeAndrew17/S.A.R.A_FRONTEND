import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/layout/sidebarForms";
import MiComponente from './formsManager';
import { useLocation } from 'react-router-dom';
import UserForm from '../../components/modals/Form_UserForm';
import { getCategoryOptions, getFormItems, addAnswers, getAnswers, editAnswers, finishRequest ,uploadImage } from '../../api/api_Forms';
import CustomButton from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Undo2, ChevronLeft , ArrowLeftCircle ,Reply, RotateCcw, CheckCircle, Upload, Image, ClipboardCheck, 
  CarFront,Building,Handshake,ListTodo,FileText , ClipboardList, Car, Check, Undo, StickyNote, Info, Calendar, Phone  } from 'lucide-react';
import GlassCardPro from "../../components/ui/glassCard";
import Swal from 'sweetalert2';
import UploadImageForm from "../../components/uploadImage/imageForm";
import { m, motion } from "framer-motion";
import ProgressBar from '../../components/ui/ProgressBar';
import {InfoLine,SideAndContent,ObservationNote,Divider,Head,Content,Body,Column} from './styles'; 
import { BackSquareButton } from '../../components/ui/BackButton'; 
import { handleAxiosError } from '../../utils/alertUnauthorized';

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
  const [respuestasPrevias, setRespuestasPrevias] = useState({});
  const [idsRespuestasPrevias, setIdsRespuestasPrevias] = useState({});
  const [formulariosRespondidos, setFormulariosRespondidos] = useState([]);//para guardar los formularios respondidos para colocarlos en verde


  const location = useLocation();
  const { id_plan, placa, plan, solicitud_id, observaciones, sucursal, convenio, tipo_vehiculo, fecha, telefono  } = location.state || {};
  const observacionesPlan = observaciones;

  // Recibe los formularios principales y adicionales desde MiComponente
  const handleFormulariosLoaded = (principales, adicionales, plan) => {
    setFormulariosPrincipales(principales);
    setFormulariosAdicionales(adicionales);
    setPlanFiltrado(plan);
  };

  useEffect(() => {
  const fetchFormulariosRespondidos = async () => {
    if (!solicitud_id || (formulariosPrincipales.length === 0 && formulariosAdicionales.length === 0)) return;

    const idsFormularios = [
      ...formulariosPrincipales.map(f => f.id),
      ...formulariosAdicionales.map(f => f.id)
    ];

    const respondidos = [];

    for (const formId of idsFormularios) { //usamos for...of para manejar async/await correctamente
      try {
        const respuestas = await getAnswers(solicitud_id, formId);
        console.log(`Respuestas para el formulario ${formId}:`, respuestas);
        if (respuestas && respuestas.length > 0) {
          respondidos.push(formId); //añadimos si se cumple la condicion para alamcenar los formularios respondidos
        }
      } catch (err) {
        console.error(`Error al verificar respuestas del formulario ${formId}:`, err);
      }
    }

    setFormulariosRespondidos(respondidos);
  };

  fetchFormulariosRespondidos();
}, [formulariosPrincipales, formulariosAdicionales, solicitud_id]);


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
        console.log("Items del formulario cargados: ", data);
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

  useEffect(() => {
  if (window.innerWidth < 500 && observacionesPlan?.trim()) {
    Swal.fire({
      title: 'Presiona el boton azul ',
      text: 'Presiona el boton azul arriba a la derecha para ver los formularios.',
      icon: 'info',
      confirmButtonText: 'Entendido',
    });
  }
}, []);



  // effect para traer la repsuestas seleccionadas del formulario selected
  useEffect(() => {
    setSelectedCategoria({});
    setRespuestasPrevias({});
    setIdsRespuestasPrevias({});

    if (!selected || !selected.id || !solicitud_id) return;
    const fetchRespuestasPrevias = async () => {
      try {
        const data = await getAnswers(solicitud_id, selected.id);

        const respuestasMap = {};
        const idsRespuestasMap = {};
        data.forEach(respuesta => {
          const valor = respuesta.respuesta_texto !== null
            ? respuesta.respuesta_texto
            : respuesta.id_opcion;
          if (valor !== undefined && valor !== null && valor !== "") {
            respuestasMap[`item_${respuesta.id_item}`] = valor;
            idsRespuestasMap[`item_${respuesta.id_item}`] = respuesta.id;
          }
        });

        setSelectedCategoria(respuestasMap);
        setRespuestasPrevias(respuestasMap);
        setIdsRespuestasPrevias(idsRespuestasMap);

      } catch (error) {
        console.error("Error al cargar las respuestas previas: ", error);
      }
    };

    fetchRespuestasPrevias();
  }, [selected, solicitud_id]);

  // Maneja el envío del formulario
  const handleSubmitForm = async () => {
    // Chequea si ya hay respuestas previas REALES para este formulario
    const checkRespuestas = Object.values(respuestasPrevias).some(
      val => val !== undefined && val !== null && val !== ""
    );

    if (checkRespuestas) {
      const result = await Swal.fire({
        title: 'Ya existen respuestas',
        text: 'Este formulario ya tiene respuestas registradas. ¿Deseas sobrescribirlas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sobrescribir',
        cancelButtonText: 'Cancelar'
      });
      if (!result.isConfirmed) return;

      // Construye el arreglo igual que en el post, pero con la estructura de arreglo
      const arrayResultados = formData.map(field => {
        const itemId = field.id_items.id;
        const idCat = field.id_items.id_categoria_opciones;

        let valor = selectedCategoria[itemId];

        // Si el valor está vacío y hay una respuesta previa, la manda para no dejar vacio el id y el backend no llore -_-
        if (
          valor === undefined || valor === null || valor === "" ||
          (typeof valor === "string" && valor.trim() === "")
        ) {
          valor = respuestasPrevias[itemId] || respuestasPrevias[`item_${itemId}`] || "";
        }

        if (String(idCat) === "16") {
          return [itemId, valor];
        } else {
          return [itemId, valor !== undefined && valor !== null && valor !== "" ? parseInt(valor, 10) : ""];
        }
      });

      try {
        const dataToUpdate = {
          solicitud: solicitud_id,
          formulario: selected.id,
          resultados: arrayResultados
        };
        console.log("Enviando", dataToUpdate)
        const response = await editAnswers(dataToUpdate);
        setSelected(null);

        setFormulariosRespondidos(prev => //para actualizar los formularios respondidos despues de la accion (no tiene sentido colocarlo aca pero bueno por si las)
        prev.includes(selected.id) ? prev : [...prev, selected.id]
      );

        await Swal.fire({
          title: 'Respuestas enviadas',
          text: 'Las respuestas se actualizaron correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'

        });
      } catch (error) {
        console.log("Error al actualizar las respuestas");

        await Swal.fire({
          title: 'Error al enviar respuestas',
          text: 'Hubo un error al enviar las respuestas. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });

      }
      return;
    } else {

      let ArrayData = [];
      for (let item = 0; item < formData.length; item++) {
        const itemId = formData[item].id_items.id;
        const opcionId = selectedCategoria[itemId];
        const idCat = formData[item].id_items.id_categoria_opciones;

        if (String(idCat) === "16") {
          ArrayData.push([itemId, opcionId]);
        } else {
          ArrayData.push([itemId, opcionId !== undefined && opcionId !== null && opcionId !== "" ? parseInt(opcionId, 10) : ""]);
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
        
        setFormulariosRespondidos(prev => 
          prev.includes(selected.id) ? prev : [...prev, selected.id]
        );

        await Swal.fire({
          title: 'Respuestas enviadas',
          text: 'Las respuestas se registraron correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

      } catch (error) {
        await Swal.fire({
          title: 'Error al enviar respuestas',
          text: 'Hubo un error al enviar las respuestas. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };

  const diccionaryCuestionario = {
    1: "Avalúo Comercial",
    2: "Inspección",
  };

  const diccionaryVehicleType = {
    1: "Livianos",
    2: "Pesados",
    3: "Motos", 
  };

  const handleFinishRequest = async () => {
    try {
      console.log("presionando finalizar");
      const response = await finishRequest(solicitud_id); 
      return navigate("/revisiones");

    } catch (error) {
      handleAxiosError(error);
    }
  }

  return (
    <motion.div
      key={location.pathname}  // Así la animación se activa al cambiar ruta
      initial={{ opacity: 0, x: 100 }} //efectos
      animate={{ opacity: 1, x: 0 }} //efectos
      exit={{ opacity: 0, x: 100 }} //animacion al salir
      transition={{ duration: 0.5, ease: "easeOut" }} //tipo de animacion
    >
    
    <SideAndContent>
      <Sidebar
        onSelect={setSelected}
        id_plan={id_plan}
        placa={placa}
        plan={plan}
        formulariosPrincipales={formulariosPrincipales}
        formulariosAdicionales={formulariosAdicionales}
        formulariosRespondidos={formulariosRespondidos}
        onContarFormularios={(principales, adicionales) => {
          setConteoPrincipales(principales);
          setConteoAdicionales(adicionales);
        }}
      />

      <Content>
        <Head>
          <BackSquareButton onClick={() => navigate(-1)}>
          <	ChevronLeft  size={22} />
          </BackSquareButton>

          <ProgressBar
            principales={conteoPrincipales}
            adicionales={conteoAdicionales}
            respondidos={formulariosRespondidos.length}
          />
        </Head>

        <Body>
          <Column>
            <UploadImageForm
              endpoint={`http://localhost:8000/result/api/subirimagen/post/`}>
                //numero en entero 
            </UploadImageForm>

            <GlassCardPro
              title="Plan:"
              badgeText={planFiltrado?.nombre_plan || "Plan no disponible"}
              icon={ClipboardList}
              headerBg="rgba(151, 200, 255, 0.4)"
              borderColor="rgba(37, 99, 235, 0.4)"
            >
              <InfoLine>
                <ListTodo size={18} color="#10B981" />
                <strong>Cuestionario •</strong> {diccionaryCuestionario[planFiltrado?.cuestionario]}
              </InfoLine>
              <InfoLine>
                <CarFront size={18} color="#3B82F6" />
                <strong>Tipo de vehículo •</strong> {diccionaryVehicleType[planFiltrado?.id_tipo_vehiculo]}
              </InfoLine>
              <InfoLine>
                <ClipboardList size={18} color="#10B981" />
                <strong>Formularios principales •</strong> {conteoPrincipales}
              </InfoLine>
              <InfoLine>
                <FileText size={18} color="#3B82F6" />
                <strong>Formularios adicionales •</strong> {conteoAdicionales}
              </InfoLine>
            </GlassCardPro>
          </Column>

          <Column>
<GlassCardPro
  title="Solicitud:"
  badgeText={placa}
  icon={Car}
  minHeight={"485px"}
  headerBg="rgba(143, 251, 255, 0.6)"
  borderColor="rgba(0, 102, 255, 0.3)"
>
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ flex: "1" }}>
      <InfoLine>
        <Handshake size={18} color="#10B981" />
        <strong>Convenio •</strong> {convenio}
      </InfoLine>
      <InfoLine>
        <Building size={18} color="#3B82F6" />
        <strong>Sucursal •</strong> {sucursal}
      </InfoLine>
      <InfoLine>
        <CarFront size={18} color="#10B981" />
        <strong>Tipo de vehículo •</strong> {diccionaryVehicleType[tipo_vehiculo]}
      </InfoLine>
      <InfoLine>
        <Calendar size={18} color="#3B82F6" style={{ marginRight: "6px" }} />
        <strong>Fecha de creación •</strong> {fecha}
      </InfoLine>
      <InfoLine>
        <Phone size={18} color="#10B981" style={{ marginRight: "6px" }} />
        <strong>Teléfono •</strong> {telefono}
      </InfoLine>

      <Divider style={{ margin: "12px 0" }} />

      {/* Observaciones */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          background: "rgba(240, 240, 240, 0.5)",
          borderRadius: "12px",
          padding: "12px",
          border: "1px dashed rgba(0,0,0,0.1)",
          minHeight: "110px", // << más alto que antes
        }}
      >
        <StickyNote
          size={22}
          color="#555"
          style={{ marginRight: "10px", marginTop: "2px" }}
        />
        <div>
          <strong>Observaciones:</strong>
          <p style={{ margin: "4px 0 0 0", color: "#444", fontSize: "14px" }}>
            {observacionesPlan || "No hay observaciones"}
          </p>
        </div>
      </div>

      {/* Texto auxiliar */}
      <p
        style={{
          marginTop: "8px",
          fontSize: "12px",
          color: "#6B7280",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        <Info
          size={18}
          style={{ position: "relative", top: "5px", marginRight: "3px" }}
        /> Completa todos los formularios y sube la imagen del vehículo para
        finalizar esta solicitud.
      </p>
    </div>

    {/* Botón fijo abajo */}
    <CustomButton
      width="100%"
      bgColor=""
      hoverColor="#48A2BF"
      onClick={handleFinishRequest}
      disabled={
        !(
          conteoPrincipales > 0 &&
          formulariosRespondidos.length === (conteoPrincipales + (conteoAdicionales || 0)) //formularios respondido con la opsibilidad de q no existan adicionales
        )
      }
      disableMessage="No puedes finalizar la solicitud hasta que respondas todos los formularios." //esta prop no sirve
      style={{
        marginTop: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      <ClipboardCheck style={{ marginRight: "6px" }} /> Finalizar
    </CustomButton>
  </div>
</GlassCardPro>


          </Column>
        </Body>

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
      </Content>
    </SideAndContent>
    </motion.div>
  );
}

export default FormsView;