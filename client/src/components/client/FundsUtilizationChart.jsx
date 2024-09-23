import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FundsUtilizationChart = ({ totalCash, availableToTrade, marginUsed }) => {
  const data = {
    labels: ["Available to Trade", "Margin Used", "Total Cash"],
    datasets: [
      {
        data: [availableToTrade, marginUsed, totalCash],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
        hoverBackgroundColor: ["#66bb6a", "#ffb74d", "#64b5f6"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Adjust the aspect ratio to fit your design
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: $${value.toFixed(2)}`; // Format the value
          },
        },
      },
    },
  };

  return (
    <div className="h-44 border">
      <Pie data={data} options={options} />
    </div>
  );
};

export default FundsUtilizationChart;
