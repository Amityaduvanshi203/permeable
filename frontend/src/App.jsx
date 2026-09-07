import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import LiveTest from "./pages/LiveTest";
import Samples from "./pages/Samples";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AboutProject from "./pages/AboutProject";

import "./styles/sidebar.css";
import "./styles/dashboard.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        <Sidebar />

        <main className="main-content">
          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/live-test"
              element={<LiveTest />}
            />

            <Route
              path="/samples"
              element={<Samples />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="/about-project"
              element={<AboutProject />}
            />

          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;