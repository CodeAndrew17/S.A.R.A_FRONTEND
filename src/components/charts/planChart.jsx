import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { getPlans } from "../../api/api_Dashboard";
import { FileSpreadsheet } from "lucide-react";
import CustomButton from "../ui/button"; 

const PlansTreemap = ({ handleClickReport }) => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await getPlans();
      const data = response.data;
      console.log("planes me los trae?", data);

      const formattedData = Object.entries(data).map(([name, value]) => ({
        x: name,
        y: value,
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
    tooltip: {
      y: {
        formatter: (val) => `${val} solicitudes`,
      },
    },
    plotOptions: {
      treemap: {
        distributed: true,
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
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
          Planes con Solicitudes
        </h2>
        <CustomButton
          onClick={() => handleClickReport("plan")}
          bgColor={"#4299E1"}
          hoverColor={"#3182CE"}
          icon={FileSpreadsheet}
        >
          Informe Planes
        </CustomButton>
      </div>


      <Chart options={options} series={series} type="treemap" height="150" width="100%" />
    </div>
  );
};

export default PlansTreemap;
