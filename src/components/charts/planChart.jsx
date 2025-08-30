import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { getPlans } from "../../api/api_Dashboard";

const PlansTreemap = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await getPlans();
      const data = response.data;
      console.log("planes me los trae?", data);

      // Transformamos el objeto { plan: cantidad } en formato treemap
      const formattedData = Object.entries(data).map(([name, value]) => ({
        x: name, // nombre del plan
        y: value // cantidad
      }));

      setSeries([{ data: formattedData }]);
    };
    fetchPlans();
  }, []);

  const options = {
    chart: {
      type: "treemap",
    },
    legend: {
      show: false, 
    },
    title: {
      text: "Planes con Solicitudes",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "600",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} solicitudes`,
      },
    },
    plotOptions: {
      treemap: {
        distributed: true, // colores distintos por plan
        enableShades: true,
      },
    },
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Chart
        options={options}
        series={series}
        type="treemap"
        height="120%"
        width="100%"
      />
    </div>
  );
};

export default PlansTreemap;
