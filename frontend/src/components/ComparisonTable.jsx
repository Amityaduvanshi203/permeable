import { useEffect, useState } from "react";
import { apiUrl } from "../api";

function ComparisonTable() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(apiUrl("/esp32/history"));
        const result = await response.json();
        if (result.status === "success") setReadings(result.data.slice(-6).reverse());
      } catch (error) {
        console.error("History table error:", error);
      }
    };

    loadHistory();
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="comparison-section">
      <div className="comparison-header">
        <div>
          <p className="comparison-label">
            SAMPLE COMPARISON
          </p>

          <h2>
            Pavement Performance Comparison
          </h2>

          <p>
            Recent readings received from the simulator or ESP32 sensor.
          </p>
        </div>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">

          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Water Level</th>
              <th>Flow Rate</th>
              <th>Infiltration Rate</th>
            </tr>
          </thead>

          <tbody>
            {readings.length === 0 ? (
              <tr><td colSpan="4">No sensor readings yet</td></tr>
            ) : readings.map((reading) => (
              <tr key={reading.timestamp}>

                <td className="sample-name">
                  {reading.timestamp ? new Date(reading.timestamp).toLocaleString() : "--"}
                </td>

                <td>{reading.water_level ?? "--"}</td>
                <td>{reading.flow_rate ?? "--"}</td>
                <td className="rate-value">{reading.infiltration_rate ?? "--"}</td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </section>
  );
}

export default ComparisonTable;