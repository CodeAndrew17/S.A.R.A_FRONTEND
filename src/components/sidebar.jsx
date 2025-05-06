import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {logout} from '../api/api_Manager';
import { FaHome, FaUsers, FaCog, FaBars, FaFileAlt, FaChartBar, FaTools, FaClipboardList, FaSignOutAlt, FaUser } from "react-icons/fa";

const SidebarContainer = styled.div`
  width: ${({ $isOpen }) => ($isOpen ? "250px" : "80px")};
  height: 100vh;
  background: #1e1e2f;
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
  border-bottom: 1px solid #29293d;
  height: 60px;
  overflow: hidden;
  margin-top: 50px;
  transition: padding 0.3s ease;
`;

const UserIcon = styled(FaUser)`
  font-size: 24px;
  min-width: 24px;
  margin-right: ${({ $isOpen }) => ($isOpen ? "15px" : "10px")};
  transition: margin 0.3s ease;
`;

const Username = styled.span`
  font-size: 15px;
  color:rgb(219, 219, 219); /* Azul pastel con un toque de blanco para suavizar */
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  margin-right: 5px;
  font-family: Helvetica, Arial, sans-serif;
  line-height: 1.5;
`;

const Rol = styled.span`
  font-size: 15px;
  color: #FFFFFF; /* Verde pastel mezclado con blanco, relajado y armonioso */
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  font-family: Helvetica, Arial, sans-serif;
  line-height: 1.5;
  
  &::before {
    content: "•";
    margin: 0 8px;
    color: #B7A8D5; /* Violeta pastel con blanco, equilibrio entre los tonos */
    font-weight: bold;
  }
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
    background: #29293d;
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
  background: rgba(0, 0, 0, 0.7);
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
  color: #ff4b5c;
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
    background: rgba(255, 75, 92, 0.1);
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
        <Rol $isOpen={isOpen}>{rol}</Rol>
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

    </SidebarContainer>
  );
};

export default Sidebar;