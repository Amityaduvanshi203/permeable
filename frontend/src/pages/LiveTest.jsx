import { useEffect, useState } from "react";
import { apiUrl } from "../api";

function LiveTest() {
  const [isRunning, setIsRunning] = useState(false);

  const [sampleName, setSampleName] = useState("");

  const [waterQuantity, setWaterQuantity] = useState("");

  const [thickness, setThickness] = useState("");

  const [esp32Connected, setEsp32Connected] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================
  // GET TEST STATUS
  // ==========================

  useEffect(() => {
    const getTestStatus = async (loadConfiguration = false) => {
      try {
        const [testResponse, esp32Response] = await Promise.all([
          fetch(apiUrl("/test/status")),
          fetch(apiUrl("/esp32/status")),
        ]);
        const result = await testResponse.json();
        const esp32Result = await esp32Response.json();

        if (result.status === "success") {
          setIsRunning(result.data.running);
          if (loadConfiguration) {
            setSampleName(result.data.configuration.sample_name || "");
            setWaterQuantity(result.data.configuration.water_quantity?.toString() || "");
            setThickness(result.data.configuration.thickness?.toString() || "");
          }
        }
        setEsp32Connected(Boolean(esp32Result.connected));
      } catch (error) {
        console.error("Test status error:", error);
      }
    };

    getTestStatus(true);
    const interval = setInterval(() => getTestStatus(false), 2000);
    return () => clearInterval(interval);
  }, []);

  // ==========================
  // START TEST
  // ==========================

  const startTest = async () => {
    if (!sampleName.trim() || !waterQuantity || !thickness || Number(waterQuantity) <= 0 || Number(thickness) <= 0) {
      setErrorMessage("Please enter a sample name, water quantity, and thickness greater than zero.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        apiUrl("/test/start"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sample_name: sampleName,
            water_quantity: Number(waterQuantity),
            thickness: Number(thickness),
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setIsRunning(result.data.running);
      } else {
        setErrorMessage(result.detail || result.message || "Unable to start the test.");
      }
    } catch (error) {
      console.error("Start test error:", error);
      setErrorMessage("Backend is not available. Please start the backend and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // STOP TEST
  // ==========================

  const stopTest = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        apiUrl("/test/stop"),
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setIsRunning(result.data.running);
      }
    } catch (error) {
      console.error("Stop test error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-test-page">
      {/* ==========================
          PAGE HEADER
      ========================== */}

      <div className="page-header">
        <div>
          <p className="page-label">
            REAL-TIME TESTING
          </p>

          <h1>
            Live Water Infiltration Test
          </h1>

          <p>
            Configure and monitor the permeable pavement
            water infiltration experiment.
          </p>
        </div>

        <div className="test-status">
          <span
            className={
              isRunning
                ? "status-dot running"
                : "status-dot"
            }
          ></span>

          {isRunning
            ? "Test Running"
            : "Test Stopped"}
        </div>
      </div>

      {/* ==========================
          MAIN GRID
      ========================== */}

      <div className="live-test-grid">

        {/* TEST CONFIGURATION */}

        <div className="test-config-card">
          <h2>Test Configuration</h2>

          <div className="form-group">
            <label>Sample Name</label>

            <input
              type="text"
              value={sampleName}
              onChange={(e) =>
                setSampleName(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Water Quantity (mL)</label>

            <input
              type="number"
              value={waterQuantity}
              onChange={(e) =>
                setWaterQuantity(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Sample Thickness (mm)</label>

            <input
              type="number"
              value={thickness}
              onChange={(e) =>
                setThickness(e.target.value)
              }
            />
          </div>

          <div className="button-group">
            <button
              className="start-test-btn"
              onClick={startTest}
              disabled={isRunning || loading}
            >
              {loading
                ? "Loading..."
                : "▶ Start Test"}
            </button>

            <button
              className="stop-test-btn"
              onClick={stopTest}
              disabled={!isRunning || loading}
            >
              {loading
                ? "Loading..."
                : "■ Stop Test"}
            </button>
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}
        </div>

        {/* LIVE STATUS */}

        <div className="live-status-card">
          <h2>Live Sensor Status</h2>

          <div className="sensor-status-box">
            <div>
              <span>Test Status</span>

              <strong
                className={
                  isRunning
                    ? "online-text"
                    : "offline-text"
                }
              >
                {isRunning
                  ? "Running"
                  : "Stopped"}
              </strong>
            </div>

            <div>
              <span>Data Source</span>

              <strong>
                Backend Controlled
              </strong>
            </div>

            <div>
              <span>ESP32 Connection</span>

              <strong>
                {esp32Connected ? "Connected" : "Waiting for ESP32"}
              </strong>
            </div>

            <div>
              <span>Current Sample</span>

              <strong>
                {sampleName}
              </strong>
            </div>
          </div>

          <div className="live-message">
            <span>ℹ️</span>

            <p>
              Test control is handled by the backend.
              Sensor data can come from simulation mode
              or the real ESP32 using the same API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveTest;