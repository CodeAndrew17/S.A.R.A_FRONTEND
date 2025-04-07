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
  overflow-y: auto;
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
  font-size: 16px;
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
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
  position: absolute;
  left: 0;
  width: 100%;
  top: ${({ $position }) => $position}px;

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

const LogoutButton = styled.button`
  background: #ff4b5c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: ${({ $isOpen }) => ($isOpen ? "5px" : "50%")};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isOpen }) => ($isOpen ? "calc(100% - 40px)" : "50px")};
  height: 50px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Mejor timing function */
  transition-property: width, border-radius; /* Solo animar estas propiedades */

  position: absolute;
  left: 48%;
  transform: translateX(-50%);
  bottom: 20px;

  &:hover {
    background: #d43f4a;
  }

  svg {
    font-size: 20px;
  }
`;

const LogoutText = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  max-width: ${({ $isOpen }) => ($isOpen ? "100px" : "0")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-10px")});
  transition: 
    max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s 0.1s ease-in-out, /* Delay en la aparición */
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${({ $isOpen }) => ($isOpen ? "15px" : "")};
  will-change: transform, opacity; /* Mejorar performance */
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(sessionStorage.getItem("sidebarOpen") === "true");
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username") || "Invitado";
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
    { icon: <FaFileAlt />, text: "Convenios", path: "/convenios" },
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

      <LogoutButton $isOpen={isOpen} onClick={logout}>
        <FaSignOutAlt />
        <LogoutText $isOpen={isOpen}>Cerrar sesión</LogoutText>
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;