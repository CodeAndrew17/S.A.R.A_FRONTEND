import { useState, useEffect, useRef } from "react";
import {useLocation} from "react-router-dom"; 
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {logout} from '../api/api_Manager';
import { FaHome, FaUsers, FaCog, FaBars, FaFileAlt, FaChartBar, FaTools, FaClipboardList, FaSignOutAlt, FaUser } from "react-icons/fa";
import { User, House, NotepadText, Users, NotebookPen, Folder, Logs } from "lucide-react";


const UserContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  padding-left: ${({ $isOpen }) => ($isOpen ? "15px" : "26px")}; /* Mismo ajuste */
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


const UserIcon = styled(User)`
  font-size: 24px;
  min-width: 24px;
  margin-right: ${({ $isOpen }) => ($isOpen ? "25px" : "25px")};
  transition: margin 0.3s ease;
  
`;

const Username = styled.span`
  font-size: 16px;
  color: rgb(219, 219, 219);
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  margin-right: 5px;
  font-family: Helvetica, Arial, sans-serif;
  line-height: 1.5;

  /* Estilos adicionales */
  font-weight: 550; 
  letter-spacing: 0.4px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 30px;
  left: 18px;
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
  padding-left: ${({ $isOpen }) => ($isOpen ? "15px" : "26px")}; 
  cursor: pointer;
  width: 100%;
  position: relative;

  &:hover {
    background: #0c3b66;
  }

  ${({ $active}) => $active && `
      background: #0b2f4d;
      box-shadow: inset 4px 0 0 #2ec4b6; /* línea amarilla al lado izquierdo */
  `}
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

const RoleTag = styled.span`
  display: inline-block;
  background-color: #e5e7eb; /* Gris neutro */
  color: #111827; /* Gris oscuro */
  font-size: 0.95rem; /* Más grande */
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  box-shadow: 0 2px 4px rgba(32, 62, 119, 0.06);
  text-align: center;
`;

//para evitar errores de inicializacion y acceder a variables antes de incializarlas 
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

const SidebarContainer = styled.div`
  width: ${({ $isOpen }) => ($isOpen ? "250px" : "80px")};
  height: 100%;
  background: linear-gradient(
    to bottom,
    #104E8B 0%,
    #1D6E94 70%,
    #2A8E9B 100%
  );
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 20px;
  transition: width 0.3s ease, transform 0.3s ease;

  @media (max-width: 800px) {
    width: ${({ $isOpen }) => ($isOpen ? "250px" : "70px")};
    transform: translateX(${({ $isHidden }) => ($isHidden ? '-100%' : '0')});
    height: 100%;
  }
`;

const MOBILE_BREAKPOINT = 800;


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(sessionStorage.getItem("sidebarOpen") === "true");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  const mobile = window.innerWidth <= MOBILE_BREAKPOINT;

  const location = useLocation(); //verificamos la ruta donde se encuentra el usuario 



  const [isHidden, setIsHidden] = useState(isMobile);

  const navigate = useNavigate();
  const username = sessionStorage.getItem("username") || "Invitado";
  const rolCode = sessionStorage.getItem("rol");
  const rol = getRolName(rolCode) || "Invitado";
  const sidebarRef = useRef(null);

useEffect(() => {
  const handleResize = () => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);
    if (!mobile) {
      setIsHidden(false);  


    }
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  useEffect(() => {
    sessionStorage.setItem("sidebarOpen", isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (document.hidden) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
        if (isMobile) {
          setIsHidden(true);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobile]);

  const menuItems = [
    { icon: <House />, text: "Inicio", path: "/inicio" },
    { icon: <NotepadText />, text: "Sucursales", path: "/sucursales" },
    { icon: <Users />, text: "Usuarios", path: "/usuarios" },
    { icon: <NotebookPen />, text: "Solicitudes", path: "/revisiones" },
    { icon: <Folder />, text: "Planes", path: "/administrar" },
  ];

  return (
    <>
      {isMobile && (
        <ToggleButton
          onClick={() => setIsHidden(prev => !prev)}
          style={{
            position: "fixed",
            top: "10px",
            left: "8px",
            zIndex: 2000,

            color: "black",
            padding: "8px",
            borderRadius: "5px",
            height: "40px"
          }}
        >
          <Logs />
        </ToggleButton>
      )}

      <SidebarContainer $isOpen={isOpen} $isHidden={isHidden} ref={sidebarRef}>
        {!isMobile && (
          <ToggleButton onClick={() => setIsOpen(prev => !prev)}>
            <Logs />
          </ToggleButton>
        )}

        <UserContainer $isOpen={isOpen}>
          <UserIcon $isOpen={isOpen} />
          <Username $isOpen={isOpen}>{username}</Username>
        </UserContainer>

        <Menu>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              $isOpen={isOpen}
              $active={location.pathname.startsWith(item.path)}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setIsHidden(true);
                }
              }}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon $isOpen={isOpen}>{item.icon}</Icon>
              <Text $isOpen={isOpen}>{item.text}</Text>
              {!isOpen && hoveredItem === index && (
                <Tooltip $show $sidebarOpen={isOpen}>
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
          <RoleTag>{rol}</RoleTag>
        </RoleContainer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;