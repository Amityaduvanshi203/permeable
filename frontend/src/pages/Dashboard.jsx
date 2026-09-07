import { useEffect, useState } from "react";
import { apiUrl } from "../api";
import { useNavigate } from "react-router-dom";

import LiveData from "../components/LiveData";
import InfiltrationChart from "../components/InfiltrationChart";
import AnalyticsCharts from "../components/AnalyticsCharts";
import PavementLayers from "../components/PavementLayers";
import ComparisonTable from "../components/ComparisonTable";

function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [testData, setTestData] = useState({ running: false, configuration: {} });
  const navigate = useNavigate();

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const [healthResponse, testResponse] = await Promise.all([
          fetch(apiUrl("/health")),
          fetch(apiUrl("/test/status")),
        ]);
        const data = await healthResponse.json();
        const testResult = await testResponse.json();

        if (data.status === "online") {
          setBackendStatus("Backend Online");
        } else {
          setBackendStatus("Backend Offline");
        }
        if (testResult.status === "success") setTestData(testResult.data);
      } catch (error) {
        setBackendStatus("Backend Offline");
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 2000);
    return () => clearInterval(interval);
  }, []);

  const configuration = testData.configuration || {};

  return (
    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            LIVE MONITORING SYSTEM
          </p>

          <h1>
            IoT Permeable Pavement Dashboard
          </h1>

          <p className="dashboard-description">
            Real-time monitoring of water infiltration through
            multi-layer permeable pavement.
          </p>

        </div>


        {/* BACKEND STATUS */}

        <div className="connection-status">

          <span
            className={`connection-dot ${
              backendStatus === "Backend Online"
                ? "online-dot"
                : ""
            }`}
          ></span>

          <span>
            {backendStatus}
          </span>

        </div>

      </div>


      {/* LIVE DATA */}

      <LiveData />


      {/* INFILTRATION CHART */}

      <InfiltrationChart />


      <AnalyticsCharts />


      {/* PAVEMENT LAYERS */}

      <PavementLayers />


      {/* COMPARISON TABLE */}

      <ComparisonTable />


      {/* BOTTOM SECTION */}

      <div className="dashboard-bottom">

        <div className="test-overview">

          <h2>
            Live Test Overview
          </h2>


          <div className="test-content">

            <div>
              <span>Sample Name</span>

              <strong>
                {configuration.sample_name || "No sample configured"}
              </strong>
            </div>


            <div>
              <span>
                Water Quantity
              </span>

              <strong>
                {configuration.water_quantity ? `${configuration.water_quantity} mL` : "--"}
              </strong>
            </div>


            <div>
              <span>
                Sample Thickness
              </span>

              <strong>
                {configuration.thickness ? `${configuration.thickness} mm` : "--"}
              </strong>
            </div>


            <div>
              <span>
                Sensor Status
              </span>

              <strong
                className={
                  backendStatus === "Backend Online"
                    ? "online-text"
                    : "offline-text"
                }
              >
                {testData.running ? "Test Running" : "Test Stopped"}
              </strong>
            </div>

          </div>

        </div>


        <div className="system-message">

          <h2>
            System Ready
          </h2>

          <p>
            Start a configured test to run the simulator, or send readings from the ESP32.
          </p>

          <button type="button" onClick={() => navigate("/live-test")}>
            Open Test Control
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;