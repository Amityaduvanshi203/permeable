import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <div className="logo-icon">💧</div>

        <div>
          <h2>PaveMonitor</h2>
          <p>IoT Monitoring System</p>
        </div>
      </div>


      <nav className="menu">

        <NavLink to="/" end>
          📊 Dashboard
        </NavLink>

        <NavLink to="/live-test">
          ▶ Live Test
        </NavLink>

        <NavLink to="/samples">
          🧱 Pavement Samples
        </NavLink>

        <NavLink to="/reports">
          📄 Reports
        </NavLink>

        <NavLink to="/settings">
          ⚙ Settings
        </NavLink>

        <NavLink to="/about-project">
          ℹ️ About Project
        </NavLink>

      </nav>


      <div className="system-status">
        <div className="status-dot"></div>

        <div>
          <strong>System Status</strong>
          <p>ESP32: Offline</p>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;