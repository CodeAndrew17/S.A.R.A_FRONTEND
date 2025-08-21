import React from "react";
import Chart from "react-apexcharts";

const SalesChart = () => {
  const options = {
    chart: { id: "solicitudes-chart" },
    xaxis: { categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"] }
  };

  const series = [
    {name: "Activas", 
    data:[15, 18, 12, 20, 22, 19, 25, 24, 20, 18, 15, 17]},
    {
      name: "Canceladas",
      data: [5, 4, 3, 6, 2, 4, 3, 5, 6, 2, 4, 3]
    },
    {
      name: "En Progreso",
      data: [25, 20, 18, 22, 24, 26, 28, 30, 25, 20, 22, 21]
    },
    {
      name: "Finalizadas",
      data: [23, 25, 27, 20, 18, 19, 21, 22, 24, 26, 28, 25]
    }
  ]

  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Solicitudes</h2>
    <Chart
      options={options}
      series={series}
      type="line"
      width="100%"
      height="100%"
    />
    </div>
  );
};

export default SalesChart;
