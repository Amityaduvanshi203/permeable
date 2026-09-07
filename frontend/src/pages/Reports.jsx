import { useEffect, useState } from "react";
import { apiUrl } from "../api";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function Reports() {
  const [readings, setReadings] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [historyResponse, reportsResponse] = await Promise.all([
          fetch(apiUrl("/esp32/history")),
          fetch(apiUrl("/test/reports")),
        ]);
        const historyResult = await historyResponse.json();
        const reportsResult = await reportsResponse.json();
        if (historyResult.status === "success") setReadings(historyResult.data);
        if (reportsResult.status === "success") {
          setReports(reportsResult.data);
          setSelectedName((currentName) => currentName || reportsResult.data[0]?.sample_name || "");
        }
      } catch (error) {
        console.error("Reports data error:", error);
      }
    };

    loadReports();
    const interval = setInterval(loadReports, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedName) return undefined;
    const loadComparison = async () => {
      try {
        const response = await fetch(apiUrl(`/test/reports/comparison?sample_name=${encodeURIComponent(selectedName)}`));
        const result = await response.json();
        if (result.status === "success") setComparison(result.data);
      } catch (error) {
        console.error("Report comparison error:", error);
      }
    };
    loadComparison();
    return undefined;
  }, [selectedName, reports]);

  const bestRate = readings.length
    ? Math.max(...readings.map((reading) => reading.infiltration_rate))
    : null;
  const sampleNames = [...new Set(reports.map((report) => report.sample_name))];
  const metricLabels = {
    average_water_level: "Water level",
    average_flow_rate: "Flow rate",
    average_infiltration_rate: "Infiltration",
    best_infiltration_rate: "Best infiltration",
  };
  const previousMetrics = comparison?.previous?.metrics;
  const currentMetrics = comparison?.current?.metrics;
  const comparisonBarData = Object.entries(metricLabels).map(([key, label]) => ({
    metric: label,
    previous: previousMetrics?.[key] || 0,
    current: currentMetrics?.[key] || 0,
  }));
  const comparisonPieData = currentMetrics ? [
    { name: "Water level", value: currentMetrics.average_water_level, color: "#1677ff" },
    { name: "Flow rate", value: currentMetrics.average_flow_rate, color: "#f59e0b" },
    { name: "Infiltration", value: currentMetrics.average_infiltration_rate, color: "#16a34a" },
  ] : [];

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <p className="page-label">SENSOR HISTORY</p>
          <h1>Test Reports</h1>
          <p>Review readings collected from the simulator or ESP32.</p>
        </div>
      </div>

      <div className="report-summary-grid">
        <div className="report-summary-card">
          <span>Total Readings</span>
          <strong>{readings.length}</strong>
          <p>Collected sensor readings</p>
        </div>
        <div className="report-summary-card green-card">
          <span>Best Infiltration</span>
          <strong>{bestRate === null ? "--" : bestRate.toFixed(2)}</strong>
          <p>Highest recorded value</p>
        </div>
        <div className="report-summary-card blue-card">
          <span>Latest Reading</span>
          <strong>
            {readings.length
              ? new Date(readings[readings.length - 1].timestamp).toLocaleTimeString()
              : "--"}
          </strong>
          <p>Most recent sensor update</p>
        </div>
      </div>

      <section className="report-comparison-card">
        <div className="reports-table-header comparison-header">
          <div>
            <p className="chart-label">REPEAT REPORT ANALYSIS</p>
            <h2>Previous vs current report</h2>
            <p>Select the same project/sample name to compare earlier work with the latest test.</p>
          </div>
          <label className="report-select-label">
            Report name
            <select value={selectedName} onChange={(event) => setSelectedName(event.target.value)} disabled={!sampleNames.length}>
              {!sampleNames.length ? <option value="">No saved reports</option> : sampleNames.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>
        {!comparison?.current ? (
          <p className="comparison-empty">Start a test with a saved sample name to build a comparison report.</p>
        ) : (
          <>
            <div className="comparison-meta">
              <span>{comparison.reports.length} report{comparison.reports.length === 1 ? "" : "s"} for <strong>{comparison.sample_name}</strong></span>
              <span>{comparison.delta ? "Latest report compared with the previous run" : "Need one more run for a before/after comparison"}</span>
            </div>
            <div className="comparison-charts">
              <div className="comparison-chart-box">
                <h3>Metric comparison</h3>
                <div className="comparison-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonBarData} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
                      <XAxis dataKey="metric" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="previous" name="Previous" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="current" name="Current" fill="#1677ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="comparison-chart-box">
                <h3>Current report distribution</h3>
                <div className="comparison-chart pie-chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={comparisonPieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                        {comparisonPieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend">
                  {comparisonPieData.map((entry) => <span key={entry.name}><i style={{ backgroundColor: entry.color }}></i>{entry.name}</span>)}
                </div>
              </div>
            </div>
            {comparison.delta && <div className="comparison-delta-grid">{Object.entries(comparison.delta).map(([key, value]) => <div key={key}><span>{metricLabels[key]}</span><strong className={value >= 0 ? "positive-delta" : "negative-delta"}>{value >= 0 ? "+" : ""}{value.toFixed(2)}</strong></div>)}</div>}
          </>
        )}
      </section>

      <div className="reports-table-card">
        <div className="reports-table-header">
          <div>
            <h2>Collected Sensor Data</h2>
            <p>Historical readings received by the backend.</p>
          </div>
        </div>
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Water Level</th>
                <th>Flow Rate</th>
                <th>Infiltration Rate</th>
              </tr>
            </thead>
            <tbody>
              {readings.length === 0 ? (
                <tr><td colSpan="4">No readings collected yet</td></tr>
              ) : (
                readings.slice().reverse().map((reading) => (
                  <tr key={reading.timestamp}>
                    <td>{new Date(reading.timestamp).toLocaleString()}</td>
                    <td>{reading.water_level ?? "--"}</td>
                    <td>{reading.flow_rate ?? "--"}</td>
                    <td className="report-rate">{reading.infiltration_rate ?? "--"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
