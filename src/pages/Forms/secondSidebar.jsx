import React from 'react';
import styled from 'styled-components';
import { FaWpforms, FaUsers, FaClipboardList } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 240px;
  height: 100vh;
  background: linear-gradient(180deg, #104E8B, #1D6E94, #2A8E9B);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
`;

const InfoBox = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const Label = styled.span`
  font-weight: bold;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  text-align: left;
  width: 100%;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Sidebar = ({ onSelect, 
  id_plan, 
  placa, 
  plan,
  formulariosPrincipales = [],
  formulariosAdicionales = []
  }) => {
  React.useEffect(() => {
    if (id_plan) {
      sessionStorage.setItem("id_plan", id_plan); //depuracion no se utiliza ya q usamos el hook useLocation y lo recibe formsview
    }
  }, [id_plan]);

  return (
    <SidebarContainer>
      <Logo>Formularios de Inspección</Logo>

      {placa && plan && (
        <InfoBox>
          <div><Label>Placa:</Label> {placa}</div>
          <div><Label>Plan:</Label> {plan}</div>
        </InfoBox>
      )}

      <h4 style={{ marginTop: '1rem',fontSize: '1.5rem' }}>Formularios Principales</h4>
      {formulariosPrincipales.length === 0 && <p>No hay formularios principales</p>}
      {formulariosPrincipales.map(form => ( //mapeamos por cada formulario principal para extraer el nombre y mostrarlo el id ya esta en la key para realizar con cada uno la accion q se requiera
        <MenuItem key={form.id} onClick={() => onSelect({id: form.id, nombre: form.nombre_formulario})}>
          {form.nombre_formulario}
          <br />
          {form.id}
        </MenuItem>
      ))}

      <h4 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>Formularios Adicionales</h4>
      {formulariosAdicionales.length === 0 && <p>No hay formularios adicionales</p>}
      {formulariosAdicionales.map(form => ( //mismo caso de arriba pero con los adicionaesl 
        <MenuItem key={form.id} onClick={() => onSelect({id: form.id, nombre: form.nombre_formulario})}>
          {form.nombre_formulario}
          <br />
          {form.id}
        </MenuItem>
      ))}

    </SidebarContainer>
  );
};

export default Sidebar;
