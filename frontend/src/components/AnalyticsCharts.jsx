import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { apiUrl } from "../api";

function AnalyticsCharts() {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [historyResponse, latestResponse] = await Promise.all([
          fetch(apiUrl("/esp32/history")),
          fetch(apiUrl("/esp32/latest")),
        ]);
        const historyResult = await historyResponse.json();
        const latestResult = await latestResponse.json();

        if (historyResult.status === "success") setHistory(historyResult.data);
        if (latestResult.status === "success") setLatest(latestResult.data);
      } catch (error) {
        console.error("Analytics data error:", error);
      }
    };

    loadHistory();
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const pieData = latest
    ? [
        { name: "Water", value: Math.max(0, latest.water_level || 0), color: "#1677ff" },
        { name: "Flow", value: Math.max(0, latest.flow_rate || 0), color: "#f59e0b" },
        { name: "Infiltration", value: Math.max(0, latest.infiltration_rate || 0), color: "#16a34a" },
      ].filter((entry) => entry.value > 0)
    : [];

  const barData = history.slice(-8).map((entry, index) => ({
    sample: entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }) : `#${index + 1}`,
    rate: entry.infiltration_rate,
  }));

  return (
    <section className="analytics-grid" aria-label="Dashboard analytics">
      <article className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <p className="chart-label">CURRENT READING</p>
            <h2>Sensor Distribution</h2>
          </div>
          <span className="chart-unit">Live values</span>
        </div>
        <div className="analytics-chart pie-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
                {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value) => Number(value).toFixed(2)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          {pieData.length === 0 ? <span>No sensor data yet</span> : pieData.map((entry) => (
            <span key={entry.name}><i style={{ backgroundColor: entry.color }}></i>{entry.name} {Number(entry.value).toFixed(2)}</span>
          ))}
        </div>
      </article>

      <article className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <p className="chart-label">SENSOR HISTORY</p>
            <h2>Infiltration Performance</h2>
          </div>
          <span className="chart-unit">L/min</span>
        </div>
        <div className="analytics-chart bar-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <XAxis dataKey="sample" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="rate" fill="#1677ff" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}

export default AnalyticsCharts;