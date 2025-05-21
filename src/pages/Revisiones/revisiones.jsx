import React, { act, useState } from "react";
import Sidebar from "../../components/sidebar";
import styled from "styled-components";
import Toolbar from "../../components/toolbar";
import UserForm from "../../components/userForm";


const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 10px; /* Espaciado del fondo */
  height: 60px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  line-height: 10px;
  margin: 0; /* Para que no interfiera con el diseño */
  position: relative;
  top: 20px; /* Ajusta el texto sin afectar el fondo */
`;

const Revisiones = () => {

  const [activeForm, setActiveForm] = useState(null);

  const handleTestForm = async () => {
    setActiveForm("FormPrueba/Vista_izquierda")
  }

  const handleFormSubmit = async (formValues) => {
    const {formName, llantaDelantera, llantaTrasera} = formValues;

    const payload = {
      DATA: [
        {
          formName: formName,
          items: {
            llantaDelantera: llantaDelantera,
            llantaTrasera: llantaTrasera
          }
        }
      ]
    };

    console.log(payload)
  }


  const handleCancelForm = () => {
    setActiveForm(null);
  }

  return (
    <div >
      <Sidebar />
      <TitleWrapper>
        <TitleText>Revisiones</TitleText>
      </TitleWrapper>
      <Toolbar
        onCreate={handleTestForm}
      >
      </Toolbar>

      {activeForm === "FormPrueba/Vista_izquierda" && (
        <UserForm
          title="Prueba de DATA"
          fields={[
            { name: "formName", 
              type: "text", 
              defaultValue: activeForm, 
              readOnly: true 
            },
            {
              name: "llantaDelantera",
              placeholder: "Llanta Delantera",
              type: "text"
            },
            {
              name: "llantaTrasera",
              placeholder: "Llanta Trasera",
              type: "text"
            }
          ]}
          initialValues={{}}//Vacio mientras sea de creación
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        >
        </UserForm>
      )}

    </div>
  );



}

export default Revisiones;
