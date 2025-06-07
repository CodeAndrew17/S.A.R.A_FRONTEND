import React from 'react';
import styled from 'styled-components';
import { ArrowLeftCircle, FileText, ClipboardList } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const SidebarContainer = styled.div`
  width: 300px;
  height: 100vh;
  background: linear-gradient(180deg, #0f1e33, #1e3a5f, #305a89);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.8rem;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
`;

const ContentWrapper = styled.div``;

const Logo = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  padding-bottom: 1.2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
`;

const InfoBox = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.7;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.span`
  font-weight: 700;
  color: #a0c4ff;
  font-size: 1.1rem;
  display: inline-block;
  min-width: 60px;
`;

const Value = styled.span`
  font-weight: 500;
  font-size: 1.1rem;
  color: #ffffff;
`;

const MenuItem = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #f0f9ff;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  text-align: left;
  width: 100%;
  border-radius: 10px;
  transition: all 0.25s ease;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateX(3px);
  }
`;

const SectionTitle = styled.h4`
  margin: 1.5rem 0 1rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #a0c4ff;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const EmptyMessage = styled.p`
  color: #cbd5e0;
  font-size: 1rem;
  padding: 1rem;
  font-style: italic;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const Footer = styled.footer`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const VolverButton = styled.button`
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 1rem;
  padding: 0.9rem 1.5rem;
  border-radius: 12px;
  margin-top: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const Sidebar = ({ onSelect, onBack, id_plan, placa, plan, formulariosPrincipales = [], formulariosAdicionales = [] }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (id_plan) {
      sessionStorage.setItem("id_plan", id_plan);
    }
  }, [id_plan]);

  return (
    <SidebarContainer>
      <ContentWrapper>
        <Logo>Formularios de Inspección</Logo>

        {placa && plan && (
          <InfoBox>
            <div><Label>Placa:</Label> <Value>{placa}</Value></div>
            <div><Label>Plan:</Label> <Value>{plan}</Value></div>
          </InfoBox>
        )}

        <SectionTitle>Formularios Principales</SectionTitle>
        {formulariosPrincipales.length === 0 && <EmptyMessage>No hay formularios principales</EmptyMessage>}
        {formulariosPrincipales.map(form => (
          <MenuItem key={form.id} onClick={() => onSelect({ id: form.id, nombre: form.nombre_formulario })}>
            <FileText size={18} />
            {form.nombre_formulario}
          </MenuItem>
        ))}

        <SectionTitle>Formularios Adicionales</SectionTitle>
        {formulariosAdicionales.length === 0 && <EmptyMessage>No hay formularios adicionales</EmptyMessage>}
        {formulariosAdicionales.map(form => (
          <MenuItem key={form.id} onClick={() => onSelect({ id: form.id, nombre: form.nombre_formulario })}>
            <ClipboardList size={18} />
            {form.nombre_formulario}
          </MenuItem>
        ))}

        <VolverButton onClick={() => navigate("/revisiones")}>
          <ArrowLeftCircle size={20} />
          Volver
        </VolverButton>
      </ContentWrapper>

      <Footer>
        © 2025 SARA App <br /> Hecho en Bogotá
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar;
