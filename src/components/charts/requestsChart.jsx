import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getRequestYear } from "../../api/api_Dashboard";

const SalesChart = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRequestYear(2025);
      const data = response.data; 
      console.log(data);

      // Hasta agosto tenemos valores, después rellenamos con ceros
      const months = 12;
      const fillArray = (value, monthCount) =>
        [...Array(months)].map((_, i) => (i < monthCount ? value : 0));

      setSeries([
        { name: "Activas", data: fillArray(data.solicitudes_activo, 8) },
        { name: "Canceladas", data: fillArray(data.solicitudes_cancelado, 8) },
        { name: "En Progreso", data: fillArray(data.solicitudes_progreso, 8) },
        { name: "Finalizadas", data: fillArray(data.solicitudes_finalizado, 8) }
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
      <Chart options={options} series={series} type="line" width="100%" height="90%" />
    </div>
  );
};

export default SalesChart;
