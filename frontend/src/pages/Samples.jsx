import { useEffect, useState } from "react";
import { apiUrl } from "../api";

function Samples() {
  const [samples, setSamples] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [newSample, setNewSample] = useState({
    name: "",
    material: "",
    thickness: "",
  });

  useEffect(() => {
    fetch(apiUrl("/samples"))
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") setSamples(result.data);
        else setErrorMessage(result.message || "Unable to load samples.");
      })
      .catch((error) => {
        console.error("Samples data error:", error);
        setErrorMessage("Backend is not available. Please start the backend.");
      });
  }, []);

  const handleChange = (e) => {
    setNewSample({
      ...newSample,
      [e.target.name]: e.target.value,
    });
  };

  const addSample = async (e) => {
    e.preventDefault();

    if (
      !newSample.name ||
      !newSample.material ||
      !newSample.thickness
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setErrorMessage("");
      const response = await fetch(apiUrl("/samples"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSample.name,
          material: newSample.material,
          thickness: Number(newSample.thickness),
        }),
      });
      const result = await response.json();
      if (result.status === "success") setSamples((current) => [...current, result.data]);
      else setErrorMessage(result.detail || result.message || "Unable to save sample.");
    } catch (error) {
      console.error("Create sample error:", error);
      setErrorMessage("Backend is not available. Sample was not saved.");
    }

    setNewSample({
      name: "",
      material: "",
      thickness: "",
    });

    setShowForm(false);
  };

  const deleteSample = async (id) => {
    try {
      const response = await fetch(apiUrl(`/samples/${id}`), { method: "DELETE" });
      if (response.ok) setSamples((current) => current.filter((sample) => sample.id !== id));
    } catch (error) {
      console.error("Delete sample error:", error);
    }
  };

  return (
    <div className="samples-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <p className="page-label">
            PAVEMENT MANAGEMENT
          </p>

          <h1>
            Pavement Samples
          </h1>

          <p>
            Manage and monitor different permeable pavement
            samples used for infiltration testing.
          </p>
        </div>

        <button
          className="add-sample-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Sample
        </button>
      </div>


      {/* ADD SAMPLE FORM */}

      {showForm && (
        <div className="add-sample-card">

          <h2>Add New Pavement Sample</h2>

          <form onSubmit={addSample}>

            <div className="sample-form-grid">

              <div className="form-group">
                <label>Sample Name</label>

                <input
                  type="text"
                  name="name"
                  value={newSample.name}
                  onChange={handleChange}
                  placeholder="Example: Pavement D"
                />
              </div>


              <div className="form-group">
                <label>Material Type</label>

                <input
                  type="text"
                  name="material"
                  value={newSample.material}
                  onChange={handleChange}
                  placeholder="Example: Permeable Concrete"
                />
              </div>


              <div className="form-group">
                <label>Thickness (mm)</label>

                <input
                  type="number"
                  name="thickness"
                  value={newSample.thickness}
                  onChange={handleChange}
                  placeholder="Example: 300"
                />
              </div>

            </div>


            <div className="sample-form-buttons">

              <button
                type="submit"
                className="save-sample-btn"
              >
                Save Sample
              </button>

              <button
                type="button"
                className="cancel-sample-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* SAMPLE CARDS */}

      <div className="samples-grid">

        {samples.length === 0 ? (
          <div className="samples-empty-state">
            <h2>No samples yet</h2>
            <p>Add a pavement sample to begin tracking it.</p>
          </div>
        ) : samples.map((sample) => (

          <div
            className="sample-card"
            key={sample.id}
          >

            <div className="sample-card-header">

              <div className="sample-title">

                <div className="sample-box-icon">
                  🧱
                </div>

                <div>
                  <h2>
                    {sample.name}
                  </h2>

                  <p>
                    {sample.material}
                  </p>
                </div>

              </div>


              <span
                className={`sample-status ${
                  sample.status === "Completed"
                    ? "completed"
                    : "pending"
                }`}
              >
                {sample.status}
              </span>

            </div>


            <div className="sample-details">

              <div>
                <span>Thickness</span>

                <strong>
                    {sample.thickness} mm
                </strong>
              </div>


              <div>
                <span>Infiltration Rate</span>

                <strong>
                    {sample.rate ?? "--"}
                </strong>
              </div>

            </div>


            <div className="sample-card-footer">

              <button className="view-sample-btn">
                View Details
              </button>

              <button
                className="delete-sample-btn"
                onClick={() => deleteSample(sample.id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

    </div>
  );
}

export default Samples;