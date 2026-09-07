import { useEffect, useState } from "react";
import { apiUrl } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function InfiltrationChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {

    const getHistory = async () => {

      try {

        const response = await fetch(
          apiUrl("/esp32/history")
        );

        const result = await response.json();

        if (result.status === "success") {

          const formattedData = result.data.map((item) => ({
            time: item.timestamp
              ? new Date(item.timestamp).toLocaleTimeString()
              : "--",

            infiltration: item.infiltration_rate,
          }));

          setChartData(formattedData);
        }

      } catch (error) {

        console.error(
          "Chart data error:",
          error
        );

      }

    };


    // First call
    getHistory();


    // Update every 2 seconds
    const interval = setInterval(
      getHistory,
      2000
    );


    return () => clearInterval(interval);

  }, []);


  return (
    <div className="chart-container">

      <div className="chart-header">

        <div>

          <p className="chart-label">
            REAL-TIME ANALYTICS
          </p>

          <h2>
            Water Infiltration Rate
          </h2>

        </div>


        <div className="live-indicator">

          <span></span>

          LIVE

        </div>

      </div>


      <div className="chart-wrapper">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={chartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
            />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="infiltration"
              stroke="#1677ff"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}


export default InfiltrationChart;