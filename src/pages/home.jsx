// src/pages/principal.jsx
import React from 'react';
import Sidebar from '../components/layout/sidebar';
import styled from 'styled-components'; 
import Card from '../components/ui/CardHome';
import iconForm from '../assets/images/iconForm.png';
import SalesChart from '../components/charts/requestsChart';
import SalesChart2 from '../components/charts/planChart';
import { getReport, getRankingUsers, getTimeSolution } from '../api/api_Dashboard';
import CustomButton  from '../components/ui/button';
import { useState, useEffect } from 'react';
import { use } from 'react';
import {getPlans} from '../api/api_Admin';
import { getBranches, getAgreement } from '../api/api_Convenios';
import {getRequest} from '../api/api_Solicitudes';
import { getUsers } from '../api/api_Usuarios';
import { Building2, Handshake, Folder, NotebookPen, UserStar,FileSliders, KeyRound,FileSpreadsheet, ShieldCheck, FileDown, AlarmClock, SquareUser   } from 'lucide-react';
import { handleAxiosError } from '../utils/alertUnauthorized';
import { getTime } from 'date-fns';

const GeneralContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(12,1fr); /*aca le decimos que vamos a usar 12 columnas */
    gap: 15px;
    max-height: 100vh;
    padding-left: 95px;
    padding-right: 20px;
    margin-top: 15px;

    @media (max-width: 800px) {
        margin-top: 90px;
        padding-left: 5px;
        padding-right: 5px;
    }
`;

const RankingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 5px;
`;

const RankingItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 10px;
    background: linear-gradient(135deg, #00b4d8, #48cae4);
    color: #fff;
    font-weight: 500;
    font-size: 13px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    font-size: 15px;
    color: #333;
`;

const FooterInfo = styled.div`
    margin-top: 15px;
    padding: 10px;
    background: #d4f5dd;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    display: flex;   
    align-items: center;
    gap: 6px;
`;

// —— estilos KPI —— 
const KPIWrapper = styled.div`
  position: relative;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #e6fffa, #ebf8ff);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const KPIIconsRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  height: 1px;
`;

const KPIValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 6px;
`;

const KPITitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* en móviles, una sola columna */
  }
`;

// Header con icono alineado
const CardHeaderStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 12px 16px;
`;

export function Inicio() {
    // const username = sessionStorage.getItem('username') || "Invitado";
    const [totalBranches, setTotalBranches] = useState(0);
    const [totalAgreements, setTotalAgreements] = useState(0);
    const [totalPlans, setTotalPlans] = useState(0);
    const [totalRequests, setTotalRequests] = useState(0);  
    const [rankingData, setRankingData] = useState([]);
    const [activeUsers, setActiveUsers] = useState(0);
    const [tiempoSolucion, setTiempoSolucion] = useState("")

        useEffect(() => {
            const fetchData = async () => {
                try {
                const [
                    branches,
                    agreements,
                    plans,
                    requests,
                    users,
                    ranking,
                    timeSolution
                ] = await Promise.all([ //ejecutamos todas las peticiones para eficientizar tiempo al momento de recibir las respuestas 
                    getBranches(),
                    getAgreement(),
                    getPlans(),
                    getRequest(),
                    getUsers(),
                    getRankingUsers(),
                    getTimeSolution()
                ]);

                setTotalBranches(branches.length);
                setTotalAgreements(agreements.length);
                setTotalPlans(plans.length);
                setTotalRequests(requests.length);
                setRankingData(ranking);
                setTiempoSolucion(timeSolution); 

                const activeUsers = users.filter(u => u.estado === "AC"); //solo traemos los usuarios activos en el aplicativo 
                setActiveUsers(activeUsers.length);

                console.log("usuarios activos:", activeUsers.length);
                console.log("ranking:", ranking);
                console.log("tiempo solucion :", timeSolution);

                } catch (error) {
                    console.error("Error al obtener los datos:", error);
                    handleAxiosError(error)
                }
        };

    fetchData();
    }, []);


    // const modelo = ""

    const handleClickReport = async (modelo) => {
        try {
            const response = await getReport(modelo);
            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_${modelo}s.xlsx`);
            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el reporte: ", error);
            handleAxiosError(error)
        }
    }


    return (
        <>
            <Sidebar />
            <GeneralContainer>
                <Card gridColumn="span 4">
          <KPIWrapper>
            <KPIIconsRow>
              <AlarmClock size={22} />
            </KPIIconsRow>
            <KPIValue>{tiempoSolucion.promedio_duracion || '0 días, 0 horas'}</KPIValue>
            <KPITitle>Promedio de respuesta</KPITitle>
          </KPIWrapper>
        </Card>

                <Card gridColumn="span 4">
                <KPIWrapper>
                    <KPIIconsRow>
                    <Building2 size={22}  />
                    <Handshake size={22}  />
                    </KPIIconsRow>

                    <KPIValue>
                    {totalBranches} · {totalAgreements}
                    </KPIValue>

                    <KPITitle>Sucursales & Convenios</KPITitle>
                </KPIWrapper>
                </Card>

                <Card gridColumn="span 4">
                <KPIWrapper>
                    <KPIIconsRow>
                    <NotebookPen size={22}/>
                    <Folder size={22} />
                    </KPIIconsRow>

                    <KPIValue>
                    {totalPlans} · {totalRequests}
                    </KPIValue>

                    <KPITitle>Planes & Solicitudes</KPITitle>
                </KPIWrapper>
                </Card>
                

                <Card gridColumn="span 9">
                

                <div style={{ padding: "0 16px 16px 16px" }}>
                    <SalesChart handleClickReport={handleClickReport}/>
                </div>
                </Card>


                <Card gridColumn="span 3">
                    <CardHeader>
                        <UserStar size={18} /> Ranking top usuarios
                    </CardHeader>

                    <RankingWrapper>
                        {Object.entries(rankingData).map(([name, count], i) => (
                        <RankingItem key={i}>
                            <span>{i + 1+" #"}. {name}</span>
                            <span>{count}</span>
                        </RankingItem>
                        ))}
                    </RankingWrapper>

                    <FooterInfo>
                        <ShieldCheck size={16} />
                        Usuarios activos: {activeUsers}
                    </FooterInfo>
                    <CustomButton
                    onClick={() => handleClickReport("usuario")}
                    bgColor={"#5A7C95"}
                    hoverColor={"#486577"}
                    icon={SquareUser}
                    >
                    Informe Usuarios
                    </CustomButton>
                </Card>


                <Card gridColumn="span 7"><SalesChart2 /> </Card>

                <Card gridColumn="span 5">
                <CardHeaderStyled>
                    <FileDown size={20} /> Descarga de reportes generales
                </CardHeaderStyled>

                <GridContainer>
                    <CustomButton
                    onClick={() => handleClickReport("convenio")}
                    bgColor={"#38B2AC"}
                    hoverColor={"#319795"}
                    icon={FileSpreadsheet}
                    >
                    Informe Convenios
                    </CustomButton>

                    <CustomButton
                    onClick={() => handleClickReport("sucursal")}
                    bgColor={"#4299E1"}
                    hoverColor={"#3182CE"}
                    icon={FileSliders}
                    >
                    Informe Sucursales
                    </CustomButton>

                    <CustomButton
                    onClick={() => handleClickReport("empleado")}
                    bgColor={"#5A7C95"}
                    hoverColor={"#486577"}
                    icon={SquareUser}
                    >
                    Informe Empleados
                    </CustomButton>

                    <CustomButton
                    onClick={() => handleClickReport("usuario")}
                    bgColor={"#5A7C95"}
                    hoverColor={"#486577"}
                    icon={SquareUser}
                    >
                    Informe Usuarios
                    </CustomButton>
                </GridContainer>
                </Card>

            </GeneralContainer>
        </>
    );
}
