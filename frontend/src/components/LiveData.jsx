import { useEffect, useState } from "react";
import { apiUrl } from "../api";

const emptyReading = {
  water_level: null,
  flow_rate: null,
  infiltration_rate: null,
};

function formatValue(value) {
  return value === null || value === undefined ? "--" : Number(value).toFixed(2);
}

function LiveData() {
  const [reading, setReading] = useState(emptyReading);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sensorResponse, testResponse] = await Promise.all([
          fetch(apiUrl("/esp32/latest")),
          fetch(apiUrl("/test/status")),
        ]);
        const sensorResult = await sensorResponse.json();
        const testResult = await testResponse.json();

        if (sensorResult.status === "success") setReading(sensorResult.data);
        if (testResult.status === "success") setIsRunning(testResult.data.running);
      } catch (error) {
        console.error("Live data error:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const data = [
    { title: "Water Level", value: formatValue(reading.water_level), unit: "units", icon: "💧", color: "blue" },
    { title: "Flow Rate", value: formatValue(reading.flow_rate), unit: "units/s", icon: "↗", color: "orange" },
    { title: "Infiltration Rate", value: formatValue(reading.infiltration_rate), unit: "units/s", icon: "↓", color: "green" },
    { title: "Test Status", value: isRunning ? "Running" : "Stopped", unit: "", icon: isRunning ? "●" : "○", color: "purple" },
  ];

  return (
    <div className="live-data-grid">
      {data.map((item) => (
        <div className={`data-card ${item.color}`} key={item.title}>
          <div className="data-card-top">
            <span>{item.title}</span>
            <span className="data-icon">{item.icon}</span>
          </div>

          <div className="data-value">
            {item.value}
            <span>{item.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LiveData;