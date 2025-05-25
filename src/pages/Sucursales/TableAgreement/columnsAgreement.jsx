import CustomButton from "../../../components/button";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import Dropdown from "../../../components/Dropdown";


const columnsAgreement = ({ setEditinAgreement, setActiveForm })=>[
    {
      key: 'nombre',
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Nombre</span>,
    },
    {
      key: 'nit',
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>NIT</span>,
    },
    {
      key: 'telefono',
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Teléfono</span>,
    },
{
  key: 'estado',
  title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Estado</span>,
  render: (estado) => (
    <span
      style={{
        color: estado === 'IN' ? '#dc3545' : '#28a745', // rojo para IN, verde para AC
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}
    >
      {estado}
    </span>
  )
},

    {
        key: 'actions',
        title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Acciones</span>,
    render: (_, record) => (
        <CustomButton
        bgColor="#5FB8D6"
        hoverColor="#519CB2"
        width="100px"
        height="35px"
        onClick={() => {
          setEditinAgreement(record); 
          setActiveForm('convenio'); 
        }}
        icon={Edit}
      >
        Editar
      </CustomButton>
    )
  }
];




export   default columnsAgreement;