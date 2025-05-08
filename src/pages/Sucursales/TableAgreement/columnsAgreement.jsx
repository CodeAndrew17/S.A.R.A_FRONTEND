import CustomButton from "../../../components/button";
import { Edit } from "lucide-react";
import React, { useState } from "react";


const columnsAgreement = [
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'nit',
      title: 'NIT',
    },
    {
      key: 'telefono',
      title: 'Teléfono',
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (estado) => (
        <span style={{
          backgroundColor: estado === 'IN' ? '#f8d7da' : '#d4edda',
          color: estado === 'Inactivo' ? '#721c24' : '#155724',
          padding: '3px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {estado}
        </span>
      )
    },
    {
        key: 'actions',
        title: 'Acciones',
        render: null
      }
  ];




export   default columnsAgreement;