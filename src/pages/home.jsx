// src/pages/principal.jsx
import React from 'react';
import Sidebar from '../components/layout/sidebar';
import styled from 'styled-components'; 
import Card from '../components/ui/CardHome';
import iconForm from '../assets/images/iconForm.png';
import SalesChart from '../components/charts/requestsChart';
import SalesChart2 from '../components/charts/planChart';
import { getReport, getRankingUsers } from '../api/api_Dashboard';
import CustomButton  from '../components/ui/button';
import { useState, useEffect } from 'react';
import { use } from 'react';
import {getPlans} from '../api/api_Admin';
import { getBranches, getAgreement } from '../api/api_Convenios';
import {getRequest} from '../api/api_Solicitudes';
import { getUsers } from '../api/api_Usuarios';
import { Building2, Handshake, Folder, NotebookPen, UserStar, KeyRound, ShieldCheck, FileDown, AlarmClock   } from 'lucide-react';

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
    const [totalBranches, setTotalBranches] = useState(0);
    const [totalAgreements, setTotalAgreements] = useState(0);
    const [totalPlans, setTotalPlans] = useState(0);
    const [totalRequests, setTotalRequests] = useState(0);  
    const [rankingData, setRankingData] = useState([]);
    const [activeUsers, setActiveUsers] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalBranches = await getBranches();
                // console.log("total sucursales: ", totalBranches.length);
                setTotalBranches(totalBranches.length);
                const totalAgreements = await getAgreement();
                // console.log("total convenios: ", totalAgreements.length);
                setTotalAgreements(totalAgreements.length);
                const plansData = await getPlans();
                // console.log("datos de los planes: ", plansData.length);
                setTotalPlans(plansData.length);
                const totalRequests = await getRequest();
                // console.log("total solicitudes: ", totalRequests.length);
                setTotalRequests(totalRequests.length);
                const userData = await getUsers();
                const filterUsersActive = userData.filter(u => u.estado === "AC");
                console.log("usuarios activos: ", filterUsersActive.length);
                setActiveUsers(filterUsersActive.length);
                const rankingData = await getRankingUsers();
                // console.log("datos del ranking de usuarios: ", rankingData);
                
            } catch (error) {
                console.error("Error al obtener el ranking de usuarios: ", error);
            }
        };

        fetchData(); 
    }, []);

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
                <Card gridColumn="span 4"><AlarmClock />Tiempo de respuesta</Card>
                <Card gridColumn="span 4"><Building2 /> <Handshake />total sucursales: {totalBranches} & convenios: {totalAgreements}</Card>
                <Card gridColumn="span 4"><NotebookPen /> <Folder />Total planes: {totalPlans} & solicitudes: {totalRequests}</Card>
                

                <Card gridColumn="span 9">
                    <SalesChart />
                </Card>
                <Card gridColumn="span 3"><UserStar />Ranking top users y usuarios(ya lo tengo) y usuarios activos: {activeUsers} <ShieldCheck /></Card>


                <Card gridColumn="span 7"><SalesChart2 /> 
                </Card>
                <Card gridColumn="span 5"><FileDown />
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
