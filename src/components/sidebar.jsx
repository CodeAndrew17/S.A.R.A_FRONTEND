import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {logout} from '../api/api_Manager';
import { FaHome, FaUsers, FaCog, FaBars, FaFileAlt, FaChartBar, FaTools, FaClipboardList, FaSignOutAlt, FaUser } from "react-icons/fa";



const SidebarContainer = styled.div`
  width: ${({ $isOpen }) => ($isOpen ? "250px" : "80px")};
  height: 100vh;
  background: linear-gradient(
    to bottom,
    #104E8B 0%,     /* Azul profesional profundo */
    #1D6E94 70%,    /* Azul más suave para transición */
    #2A8E9B 100%    /* Verde agua marina apagado para acento */
  );
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 20px;
  overflow: hidden;
  z-index: 1000;
`;


const UserContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  height: 80px;
  margin-top: 50px;
  margin-bottom: 10px;
  transition: padding 0.3s ease;
  position: relative; /* Para posicionar el pseudo-elemento */

  /* Aquí eliminamos el border-bottom */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 20px; /* Espacio a la izquierda */
    right: 20px; /* Espacio a la derecha */
    height: 1px; /* Ancho de la línea */
    background-color: rgba(10, 30, 60, 0.2); /* Color de la línea */
  }
`;


const UserIcon = styled(FaUser)`
  font-size: 24px;
  min-width: 24px;
  margin-right: ${({ $isOpen }) => ($isOpen ? "15px" : "10px")};
  transition: margin 0.3s ease;
`;

const Username = styled.span`
  font-size: 16px;
  color:rgb(219, 219, 219); /* Azul pastel con un toque de blanco para suavizar */
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  margin-right: 5px;
  font-family: Helvetica, Arial, sans-serif;
  line-height: 1.5;
`;



const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  position: relative;  // Cambiado de absolute a relative
  width: 100%;

  &:hover {
    background: #0c3b66;
  }
`;

const Icon = styled.div`
  font-size: 24px;
  margin-right: ${({ $isOpen }) => ($isOpen ? "15px" : "0")};
  transition: margin 0.3s ease;
`;

const Text = styled.span`
  display: ${({ $isOpen }) => ($isOpen ? "inline" : "none")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  font-size: 16px; 
  font-family: Helvetica, Arial, sans-serif;
  transition: opacity 0.3s ease;
`;


const Tooltip = styled.div`
  display: ${({ $show }) => ($show ? "block" : "none")};
  position: fixed;
  left: ${({ $sidebarOpen }) => ($sidebarOpen ? "260px" : "85px")};
  background: rgba(52, 75, 110, 0.85);
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(112, 110, 110, 0.2);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  transition: left 0.3s ease;
  pointer-events: none;
`;


const LogoutWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 18px; /* Misma altura que el botón de menú */
  right: ${({ $isOpen }) => ($isOpen ? '25px' : '-40px')}; /* Se esconde fuera del sidebar */
  z-index: 1001;
  transition: right 0.3s ease;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: #ff6666;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  svg {
    font-size: 18px;
  }
`;



const getRolName = (rolCode) => {
  const roles = {
    'AD': 'Administrador',
    'PR': 'Perito',
    'RC': 'Recepcionista',
    'CA': 'Administrador Convenio',
    'CC': 'Consultor Convenio'
  };
  return roles[rolCode] || "Invitado";
};

const RoleContainer = styled.div`
  padding: 10px 20px;
  background: linear-gradient(to right, #104E8B, #1D6E94, #2A8E9B);
  color: #ffffffcc;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  border-top: 1px solid #1a3c66;
  position: sticky;
  bottom: 0;
  z-index: 5;
  overflow: hidden;

  /* Transición elegante */
  max-height: ${({ $isOpen }) => ($isOpen ? '60px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  padding-top: ${({ $isOpen }) => ($isOpen ? '10px' : '0')};
  padding-bottom: ${({ $isOpen }) => ($isOpen ? '10px' : '0')};
`;



const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(sessionStorage.getItem("sidebarOpen") === "true");
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username") || "Invitado";
  const rolCode = sessionStorage.getItem("rol");
  const rol = getRolName(rolCode) || "inivitado";
  const sidebarRef = useRef(null);

  // Actualizar sessionStorage cuando isOpen cambia
  useEffect(() => {
    sessionStorage.setItem("sidebarOpen", isOpen);
  }, [isOpen]);

  // Cerrar el sidebar al hacer clic fuera de él
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (document.hidden) return;

      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const menuItems = [
    { icon: <FaHome />, text: "Inicio", path: "/inicio" },
    { icon: <FaFileAlt />, text: "Sucursales", path: "/sucursales" },
    { icon: <FaTools />, text: "Revisiones", path: "/revisiones" },
    { icon: <FaClipboardList />, text: "Administrar", path: "/administrar" },
    { icon: <FaChartBar />, text: "Estadísticas", path: "/estadisticas" },
    { icon: <FaUsers />, text: "Usuarios", path: "/usuarios" },
    { icon: <FaCog />, text: "Configuración", path: "/configuracion" },
  ];

  const iconPositions = [180, 240, 300, 360, 420, 480, 540];

  return (
    <SidebarContainer $isOpen={isOpen} ref={sidebarRef}>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </ToggleButton>

      <UserContainer $isOpen={isOpen}>
        <UserIcon $isOpen={isOpen} />
        <Username $isOpen={isOpen}>{username}</Username>
      </UserContainer>

      <Menu>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            $position={iconPositions[index]}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Icon $isOpen={isOpen}>{item.icon}</Icon>
            <Text $isOpen={isOpen}>{item.text}</Text>
            {!isOpen && hoveredItem === index && (
              <Tooltip $show={hoveredItem === index} $sidebarOpen={isOpen}>
                {item.text}
              </Tooltip>
            )}
            
          </MenuItem>
        ))}
        
      </Menu>

      <LogoutWrapper $isOpen={isOpen}>
        <LogoutButton onClick={logout}>
          <FaSignOutAlt />
        </LogoutButton>
      </LogoutWrapper>



      <RoleContainer $isOpen={isOpen}>
        <span>Administrador</span>
      </RoleContainer>

    </SidebarContainer>
  );
};

export default Sidebar;