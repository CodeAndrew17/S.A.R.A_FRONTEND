// src/pages/principal.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import styled from 'styled-components'; 
import CustomButton from '../components/button';
import iconForm from '../assets/images/iconForm.png';

// CSS para el texto de bienvenida
const UserInfo = styled.div`
    justify-content: center;
    margin-top: -680px;
    font-size: 25px;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 20px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const StyledIconForm = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 5%; /* Ejemplo: hazla circular */
    margin-top: -680px;
`;


export function Inicio() {
    const username = sessionStorage.getItem('username') || "Invitado";


    return (
        <div>
            <Sidebar />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <StyledIconForm src={iconForm} alt="Logo" />

            </div>
        </div>
    );
}
