import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getRequestYear } from "../../api/api_Dashboard";
import { FileSpreadsheet } from "lucide-react";
import CustomButton from "../ui/button"; 

const SalesChart = ({ handleClickReport }) => {
  const [series, setSeries] = useState([]);

  const monthsOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRequestYear(2025);
      const data = response.data; 
      console.log(data);

      const activas = monthsOrder.map(m => data[m]?.solicitudes_activo || 0); 
      const canceladas = monthsOrder.map(m => data[m]?.solicitudes_cancelado || 0); 
      const progreso = monthsOrder.map(m => data[m]?.solicitudes_progreso || 0); 
      const finalizadas = monthsOrder.map(m => data[m]?.solicitudes_finalizado || 0); 

      setSeries([
        { name: "Activas", data: activas },
        { name: "Canceladas", data: canceladas },
        { name: "En Progreso", data: progreso },
        { name: "Finalizadas", data: finalizadas }
      ]);
    };

    fetchData();
  }, []);

  const options = {
    chart: { id: "solicitudes-chart" },
    xaxis: {
      categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "1px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600" }}>Solicitudes</h2>
        <CustomButton
          onClick={() => handleClickReport("solicitud")}
          bgColor={"#38B2AC"}
          hoverColor={"#319795"}
          icon={FileSpreadsheet}
        >
          Informe Solicitudes
        </CustomButton>
      </div>


      <Chart options={options} series={series} type="line" width="100%" height="180" />
    </div>
  );
};

export default SalesChart;
