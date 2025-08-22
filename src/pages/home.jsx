// src/pages/principal.jsx
import React from 'react';
import Sidebar from '../components/layout/sidebar';
import styled from 'styled-components'; 
import Card from '../components/ui/CardHome';
import iconForm from '../assets/images/iconForm.png';
import SalesChart from '../components/charts/requestsChart';
import SalesChart2 from '../components/charts/planChart';
import { getReport } from '../api/api_Dashboard';
import CustomButton  from '../components/ui/button';

const GeneralContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(12,1fr); /*aca le decimos que vamos a usar 12 columnas */
    gap: 15px;
    max-height: 100vh;
    padding-left: 95px;
    padding-right: 20px;
`;

// const Card = styled.div`
//     background: #fff;         /* fondo blanco (luego puedes cambiarlo) */
//     border: 1px solid #ddd;   /* borde ligero */
//     border-radius: 8px;       /* esquinas redondeadas */
//     padding: 16px;            /* espacio interno */
//     display: flex;            /* para alinear contenido dentro */
//     flex-direction: column;   /* contenido en columna */
//     justify-content: center;
//     align-items: center;
// `;


export function Inicio() {
    // const username = sessionStorage.getItem('username') || "Invitado";
    const handleClickReport = async () => {
        try {
            const response = await getReport();
            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('dowland', 'reporte_general.xlsx');
            document.body.appendchild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el reporte: ", error);
        }
    }


    return (
        <>
            <Sidebar />
            <GeneralContainer>
                <Card gridColumn="span 4">Tiempo de respuesta</Card>
                <Card gridColumn="span 4">Usuarios activos</Card>
                <Card gridColumn="span 4">Total planes</Card>
                

                <Card gridColumn="span 9">
                    <SalesChart />
                </Card>
                <Card gridColumn="span 3">Ranking top users</Card>


                <Card gridColumn="span 7"><SalesChart2 /> 
                </Card>
                <Card gridColumn="span 5">
                    Descarga reportes generales
                    <CustomButton
                    onClick={handleClickReport}
                    >
                        Descargar</CustomButton>
                </Card>

            </GeneralContainer>
        </>
    );
}
