function AboutProject() {
  return (
    <div className="about-project-page">

      {/* HEADER */}
      <div className="about-header">
        <p className="page-label">PROJECT INFORMATION</p>

        <h1>About IoT Permeable Pavement System</h1>

        <p>
          An IoT-based real-time monitoring system designed to measure
          water infiltration performance in permeable pavement structures.
        </p>
      </div>


      {/* PROJECT OVERVIEW */}
      <div className="about-card">
        <h2>💧 Project Overview</h2>

        <p>
          Permeable pavement is designed to allow rainwater to pass
          through different pavement layers and infiltrate into the
          ground.
        </p>

        <p>
          This project uses IoT sensors and an ESP32 microcontroller to
          monitor water flow and infiltration performance in real time.
          The collected data is sent to a FastAPI backend and displayed
          on a React dashboard.
        </p>
      </div>


      {/* HOW IT WORKS */}
      <div className="about-card">
        <h2>⚙️ How the System Works</h2>

        <div className="workflow">

          <div className="workflow-step">
            <span>1</span>
            <div>
              <h3>Water Added</h3>
              <p>
                A fixed quantity of water is added to the permeable
                pavement sample.
              </p>
            </div>
          </div>

          <div className="workflow-step">
            <span>2</span>
            <div>
              <h3>Sensor Measurement</h3>
              <p>
                Water level and flow sensors measure the movement of
                water through the pavement.
              </p>
            </div>
          </div>

          <div className="workflow-step">
            <span>3</span>
            <div>
              <h3>ESP32 Processing</h3>
              <p>
                ESP32 collects the sensor readings and prepares the
                data for transmission.
              </p>
            </div>
          </div>

          <div className="workflow-step">
            <span>4</span>
            <div>
              <h3>FastAPI Backend</h3>
              <p>
                The ESP32 sends sensor data to the FastAPI backend using
                Wi-Fi and HTTP requests.
              </p>
            </div>
          </div>

          <div className="workflow-step">
            <span>5</span>
            <div>
              <h3>Live Dashboard</h3>
              <p>
                The React dashboard displays live readings, charts,
                test results and sample comparisons.
              </p>
            </div>
          </div>

        </div>
      </div>


      {/* TECHNOLOGY */}
      <div className="about-grid">

        <div className="about-card">
          <h2>🔌 Hardware Components</h2>

          <ul className="about-list">
            <li>ESP32 Microcontroller</li>
            <li>Water Level Sensor</li>
            <li>Water Flow Sensor</li>
            <li>Power Supply</li>
            <li>Permeable Pavement Sample</li>
            <li>Connecting Wires</li>
          </ul>
        </div>


        <div className="about-card">
          <h2>💻 Software Technologies</h2>

          <ul className="about-list">
            <li>React.js Frontend</li>
            <li>Vite Development Environment</li>
            <li>FastAPI Backend</li>
            <li>Python</li>
            <li>REST API Communication</li>
            <li>ESP32 Wi-Fi Communication</li>
          </ul>
        </div>

      </div>


      {/* DATA FLOW */}
      <div className="about-card">
        <h2>📡 System Data Flow</h2>

        <div className="data-flow">

          <div>💧 Sensors</div>

          <span>→</span>

          <div>⚡ ESP32</div>

          <span>→</span>

          <div>🌐 FastAPI</div>

          <span>→</span>

          <div>📊 React Dashboard</div>

        </div>
      </div>


      {/* FEATURES */}
      <div className="about-card">
        <h2>📊 System Features</h2>

        <div className="features-grid">

          <div className="feature-box">
            <span>📡</span>
            <h3>Real-Time Monitoring</h3>
            <p>
              Monitor sensor readings in real time.
            </p>
          </div>

          <div className="feature-box">
            <span>📈</span>
            <h3>Live Analytics</h3>
            <p>
              View infiltration rate and water flow charts.
            </p>
          </div>

          <div className="feature-box">
            <span>🧪</span>
            <h3>Sample Comparison</h3>
            <p>
              Compare performance between multiple pavement samples.
            </p>
          </div>

          <div className="feature-box">
            <span>📋</span>
            <h3>Test Records</h3>
            <p>
              Store and analyze pavement test results.
            </p>
          </div>

        </div>
      </div>


      {/* FUTURE SCOPE */}
      <div className="about-card future-card">
        <h2>🚀 Future Scope</h2>

        <ul className="about-list">
          <li>Cloud database integration</li>
          <li>Automatic report generation</li>
          <li>Mobile application</li>
          <li>Multiple sensor monitoring</li>
          <li>AI-based pavement performance prediction</li>
          <li>Rainfall and environmental sensor integration</li>
        </ul>
      </div>

    </div>
  );
}

export default AboutProject;