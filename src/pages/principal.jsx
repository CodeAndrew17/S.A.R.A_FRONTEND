// src/pages/principal.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import styled from 'styled-components'; 
import { User } from 'lucide-react';
import CustomButton from '../components/button';

// CSS para el texto de bienvenida
const UserInfo = styled.div`
    position: absolute;  /* Lo posicionamos manualmente */
    top: 50px;          /* Margen desde la parte superior */
    right: 65px;        /* Lo empujamos hacia la derecha */
    font-size: 20px;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 20px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

// CSS para el icono de usuario
const UserIcon = styled(User)`
    position: absolute;
    top: 50px; /* Ajusta el valor para moverlo más abajo */
    right: 20px; /* Ajusta según sea necesario */
    background-color:rgb(169, 174, 175);
    padding: 8px;
    border-radius: 50%;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Principal = styled.div`
    justify-content: center;
    display: flex;
`;


export function Inicio() {
    const username = sessionStorage.getItem('username') || "Invitado";


    return (
        <div>
            <Sidebar />
            <UserIcon size={30} />
            <UserInfo style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                Bienvenido, {username}
            </UserInfo>
                <Principal>
                <h1> Esta es la pagina principal </h1>
                </Principal>
        </div>
    );
}
