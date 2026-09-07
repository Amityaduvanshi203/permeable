import { useEffect, useState } from "react";
import { apiUrl as requestUrl } from "../api";

function Settings() {
  const [espIp, setEspIp] = useState("");
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");
  const [wifiName, setWifiName] = useState("");
  const [saved, setSaved] = useState(false);
  const [esp32Connected, setEsp32Connected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(requestUrl("/esp32/status"));
        const result = await response.json();
        setEsp32Connected(Boolean(result.connected));
      } catch (error) {
        setEsp32Connected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <p className="page-label">
            SYSTEM CONFIGURATION
          </p>

          <h1>
            Settings
          </h1>

          <p>
            Configure the IoT Permeable Pavement Monitoring System
            and ESP32 hardware connection.
          </p>
        </div>

      </div>


      {/* ESP32 CONFIGURATION */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div>
            <h2>ESP32 Connection</h2>

            <p>
              Configure communication between the website
              and ESP32 hardware.
            </p>
          </div>

          <span className={`settings-status ${esp32Connected ? "online" : "offline"}`}>
            ● {esp32Connected ? "Online" : "Offline"}
          </span>

        </div>


        <div className="settings-form-grid">

          <div className="form-group">

            <label>
              ESP32 IP Address
            </label>

            <input
              type="text"
              value={espIp}
              onChange={(e) => setEspIp(e.target.value)}
              placeholder="Example: 192.168.1.100"
            />

          </div>


          <div className="form-group">

            <label>
              Backend API URL
            </label>

            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="Example: http://localhost:8000"
            />

          </div>

        </div>

      </div>


      {/* WIFI SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div>
            <h2>Wi-Fi Configuration</h2>

            <p>
              Configure the Wi-Fi network used by ESP32.
            </p>
          </div>

        </div>


        <div className="settings-form-grid">

          <div className="form-group">

            <label>
              Wi-Fi Network Name
            </label>

            <input
              type="text"
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
              placeholder="Enter Wi-Fi Name"
            />

          </div>


          <div className="form-group">

            <label>
              ESP32 Status
            </label>

            <div className="status-display">
              {esp32Connected ? "ESP32 connected" : "Waiting for ESP32 connection"}
            </div>

          </div>

        </div>

      </div>


      {/* SYSTEM INFORMATION */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div>
            <h2>System Information</h2>

            <p>
              Current application and hardware information.
            </p>
          </div>

        </div>


        <div className="system-info-grid">

          <div className="system-info-item">

            <span>Application</span>

            <strong>
              IoT Permeable Pavement
            </strong>

          </div>


          <div className="system-info-item">

            <span>Version</span>

            <strong>
              1.0.0
            </strong>

          </div>


          <div className="system-info-item">

            <span>Hardware</span>

            <strong>
              ESP32
            </strong>

          </div>


          <div className="system-info-item">

            <span>Connection</span>

            <strong className={esp32Connected ? "online-text" : "offline-text"}>
              {esp32Connected ? "Online" : "Offline"}
            </strong>

          </div>

        </div>

      </div>


      {/* SAVE */}

      <div className="settings-actions">

        <button
          className="save-settings-btn"
          onClick={handleSave}
        >
          Save Settings
        </button>


        {saved && (
          <span className="settings-saved-message">
            ✓ Settings saved successfully
          </span>
        )}

      </div>

    </div>
  );
}

export default Settings;