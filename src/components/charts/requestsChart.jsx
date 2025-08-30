import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getRequestYear } from "../../api/api_Dashboard";

const SalesChart = () => {
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

      // Hasta agosto tenemos valores, después rellenamos con ceros
      
      const activas = monthsOrder.map(m => data[m]?.solicitudes_activas || 0); 
      const canceladas = monthsOrder.map(m => data[m]?.solicitudes_canceladas || 0); 
      const progreso = monthsOrder.map(m => data[m]?.solicitudes_progreso || 0); 
      const finalizadas = monthsOrder.map(m => data[m]?.solicitudes_finalizadas || 0); 

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
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Solicitudes</h2>
      <Chart options={options} series={series} type="line" width="100%" height="80%" />
    </div>
  );
};

export default SalesChart;
