import React from "react";
import Chart from "react-apexcharts";

const SalesChart2 = () => {
  const options = {
    chart: { id: "planes-chart" },
    xaxis: { categories: ["Plan Básico", "Plan Premium", "Plan Autosef", "Plan Ejecutivo"] },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "50%" }
    }
  };

  const series = [
    {
      name: "Cantidad de Planes",
      data: [18, 9, 28, 12] // cada valor corresponde al label en xaxis.categories
    }
  ];

  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Planes</h2>
      <Chart
        options={options}
        series={series}
        type="bar"
        height='100%'
        width='100%'
      />
    </div>
  );
};

export default SalesChart2;
