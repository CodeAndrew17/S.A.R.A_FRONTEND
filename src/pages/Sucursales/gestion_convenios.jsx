import Table from "../../components/table";
import Toolbar from "../../components/Toolbar";
import styled from "styled-components";
import columns from "./TableAgreement/columnsAgreement"; 
import UserForm from "../../components/userForm";
import React, { useState, useEffect } from "react";
import {getConvenios,addConvenios} from "../../api/api_Convenios"; 
import CustomButton from "../../components/button";

import Swal from "sweetalert2";
import { Await } from "react-router-dom";



const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Oscurece el fondo */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  padding: 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 800px; /* Ajusta según el tamaño que desees */
  height: auto; /* Se adapta al contenido */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;



const GestionConvenios = ({ title = "Gestión de Convenios", onCerrar }) => {
    //*Varibles globales de Estados
    const [convenios, setConvenios] = useState([]);
    const [activeForm, setActiveForm] = useState(false);
    const [loading, setLoading] = useState(true);


    //*Funciones para la Activacion de hoosk
    const handleForm = () => setActiveForm(true);
    const closeForm = () => setActiveForm(false);

    //*Funciones para CRUD de Convenios 

    //?Funcion para la Creacion de Convenios 
    
    const handleFormSubmit = async (formData) => {
        try {
            const telefono = parseInt(formData.telefono, 10);  
        
            if (isNaN(telefono)) {
                throw new Error("El teléfono no es válido.");
            }
    
            const dataToSend = { 
                ...formData, 
                telefono
            };
            console.log("Datos enviados al backend", dataToSend);
    
            await addConvenios(dataToSend);
    
            // Mostrar éxito
            Swal.fire({
                title: "Éxito",
                text: "El convenio se ha creado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
    
            closeForm(); // Cierra el formulario
    
            // Actualiza la tabla
            const updatedConvenios = await getConvenios();
            setConvenios(updatedConvenios);
            
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo crear el usuario. Verifica los datos ingresados.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    };
    


    //*Funcion para Cargar los Datos en la table 
    useEffect(() => {
        const fetchConvenios = async () => { 
          try {
            setLoading(true); //iniica la carga de datos 
            const data = await getConvenios();
            setConvenios(data)
            setLoading(false); 
          } catch (error) {
            setLoading(false);
          }
        };

        fetchConvenios();
    }, []);

  
    return (
      <ModalContainer >
        <FormContainer>
          <h1>{title}</h1>
          <Toolbar onCreate={handleForm} />
          <Table 
            containerStyle={{ marginLeft: '10px' }}
            selectable={true}
            data={convenios}
            columns={columns}
            onRowClick={(convenio) => console.log('Convenio seleccionado:', convenio)}
          />
          <CustomButton 
          onClick={onCerrar}
bgColor="#8A8A8A"  /* Gris más claro y neutro */
hoverColor="#747474"
          width="120px" 
          height="30px"

          >Cerrar</CustomButton>
          
          {activeForm && (
            <UserForm
              title="Crear Convenio"
              fields={[ 
                { name: "nombre", placeholder: "Nombre", type: "text" },
                { name: "nit", placeholder: "NIT", type: "number" },
                { name: "telefono", placeholder: "Teléfono", type: "tel" },
              ]}
              onCancel={closeForm} 
              onSubmit={handleFormSubmit}
            />
          )}
        </FormContainer>
      </ModalContainer>
    );
  };

export default GestionConvenios;