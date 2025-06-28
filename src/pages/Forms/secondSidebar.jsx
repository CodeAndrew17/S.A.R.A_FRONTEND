import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import { ArrowLeftCircle, FileText, ClipboardList, ChevronDown, CheckCircle, FilePlus } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import autosef from "../../assets/images/autosef.png"

const SidebarContainer = styled.div`
  width: 260px;
  min-height: 100%;
  height: 100vh;  /* Lo intenta, pero el min-height asegura respaldo */
  background: linear-gradient(to bottom, #104E8B 0%, #1D6E94 70%, #2A8E9B 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.8rem;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  scrollbar-width: none;
  z-index: 1000;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 500px) {
    max-width: 150px;
  }
`;


const LogoImage = styled.img`
  width: 80%;
  max-width: 180px;
  margin: 0 auto 1.5 rem auto;
  padding-bottom: 1.5rem;
  display: block;
  object-fit: contain;
  padding-left: 35px;

  @media (max-width : 768px) {
    width: 70%;
    max-width: 140px;
    margin-bottom: 0.8rem;
    padding-left: 15px;
  }
`;

const ScrollIndicator = styled.div`
  position: fixed;
  left: 125px;
  bottom: 15px;
  color: white;
  opacity: ${({ $visible }) => ($visible ? 0.7 : 0)};
  pointer-events: none;
  transition: opacity 0.3s ease;
  animation: bounce 1.5s infinite;
  z-index: 10;

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(8px);
    }
  }

  @media (max-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 100%;
  
  @media (min-width: 1200px) {
    max-width: 280px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const InfoBox = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  line-height: 1.6;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  height: 15px;
  width: 225px;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.95rem;
    width: 120px;
    height: 7px;
  }
`;

const Label = styled.span`
  font-weight: 700;
  color: #a0c4ff;
  font-size: 1rem;
  display: inline-block;
  min-width: 50px;

  @media (max-width: 768px) {
    min-width: 45px;
    font-size: 0.95rem;
  }
`;

const Value = styled.span`
  font-weight: 500;
  font-size: 1rem;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const MenuItem = styled.button`
  background: ${({ $respondido }) =>
    $respondido ? 'rgba(0, 200, 100, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ $respondido }) => ($respondido ? '#a8f0c6' : '#f0f9ff')};
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.2rem;
  margin-bottom: 0.6rem;
  cursor: pointer;
  text-align: left;
  width: 100%;
  border-radius: 8px;
  border: none;
  transition: all 0.25s ease;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${({ $respondido }) =>
      $respondido ? 'rgba(0, 200, 100, 0.25)' : 'rgba(255, 255, 255, 0.15)'};
    color: #ffffff;
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateX(3px);
  }
`;

const SectionTitle = styled.h4`
  margin: 2rem 0 1rem;
  font-size: 1.15rem;
  font-weight: 700;
  color:rgb(148, 225, 255);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;

  &::before {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.25));
    border-radius: 1px;
  }

  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(to left, transparent, rgba(255, 255, 255, 0.25));
    border-radius: 1px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 1.5rem 0 0.8rem;
  }
`;

const EmptyMessage = styled.p`
  color: #cbd5e0;
  font-size: 0.95rem;
  padding: 0.8rem;
  font-style: italic;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.7rem;
  }
`;

const Footer = styled.footer`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    margin-top: 1rem;
    padding-top: 0.8rem;
    font-size: 0.75rem;
  }
`;

const VolverButton = styled.button`
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 1rem;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  margin-top: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
    margin-top: 1rem;
  }
`;

const PlacaHeading = styled.h4`
  margin-top: -3px;
  text-align: center;
  letter-spacing: 0.2em;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 650;
  font-size: clamp(0.95rem, 1.2vw, 1.2rem);  /* Se adapta dinámicamente */

  @media (max-width: 500px) {
    font-weight: 500;
  }
`;

// El componente Sidebar permanece exactamente igual
const Sidebar = ({
  onSelect,
  onBack,
  id_plan,
  placa,
  plan,
  formulariosPrincipales = [],
  formulariosAdicionales = [],
  onContarFormularios,
  formulariosRespondidos = [],
}) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [arrowTop, setArrowTop] = useState(0); 
  const [arrowVisible, setArrowVisible] = useState(true);

  React.useEffect(() => {
    if (id_plan) {
      sessionStorage.setItem("id_plan", id_plan);
    }
  }, [id_plan]);

  useEffect(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar) return; 

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = sidebar;

      const newTop = scrollTop + clientHeight - 40;
      setArrowTop(newTop);

      const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
      setArrowVisible(!atBottom);
    };

    sidebar.addEventListener('scroll', handleScroll);
    handleScroll(); // inicializa la posición

    return () => {
      sidebar.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
  if (typeof onContarFormularios === "function") {
    onContarFormularios(formulariosPrincipales.length, formulariosAdicionales.length);
  }
}, [formulariosPrincipales, formulariosAdicionales]);

  return (
    <SidebarContainer ref={sidebarRef}>
      <ContentWrapper>
        <LogoImage src={autosef} alt="Autosef logo" />

        <InfoBox>
          <PlacaHeading>{placa.slice(0, 3) + ' · ' + placa.slice(3)}</PlacaHeading>
        </InfoBox>

        <SectionTitle><span>Formularios Principales</span></SectionTitle>
        {formulariosPrincipales.length === 0 && <EmptyMessage>No hay formularios principales</EmptyMessage>}

        {formulariosPrincipales.map(form => {
          const respondido = formulariosRespondidos.includes(form.id);
          return (
            <MenuItem
              key={form.id}
              onClick={() => onSelect({ id: form.id, nombre: form.nombre_formulario })}
              $respondido={respondido}
            >
              <FileText size={18} />
              {form.nombre_formulario}
              {respondido && (
                <CheckCircle size={16} color="#50fa7b" style={{ marginLeft: 'auto' }} />
              )}
            </MenuItem>
          );
        })}

        <SectionTitle><span>Formularios Adicionales</span></SectionTitle>
        {formulariosAdicionales.length === 0 && <EmptyMessage>No hay formularios adicionales</EmptyMessage>}

        {formulariosAdicionales.map(form => {
          const respondido = formulariosRespondidos.includes(form.id);
          return (
            <MenuItem
              key={form.id}
              onClick={() => onSelect({ id: form.id, nombre: form.nombre_formulario })}
              $respondido={respondido}
            >
              <FilePlus size={18} />
              {form.nombre_formulario}
              {respondido && (
                <CheckCircle size={16} color="#50fa7b" style={{ marginLeft: 'auto' }} />
              )}
            </MenuItem>
          );
        })}

        <VolverButton onClick={() => navigate("/revisiones")}>
          <ArrowLeftCircle size={20} />
          Volver
        </VolverButton>
      </ContentWrapper>

      <Footer>
        © 2025 SARA App <br /> Hecho en Bogotá
      </Footer>

      <ScrollIndicator $visible={arrowVisible}>
        <ChevronDown size={34} />
      </ScrollIndicator>
    </SidebarContainer>
  );
};

export default Sidebar;