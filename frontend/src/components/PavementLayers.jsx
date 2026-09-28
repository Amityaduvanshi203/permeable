function PavementLayers() {
  const layers = [
    {
      number: "1",
      name: "Pervious block layer",
      material: "Permeable concrete blocks / pavers",
      thickness: "80 mm",
      className: "paver-layer",
    },
    {
      number: "2",
      name: "Sacrificial layer",
      material: "Coarse aggregate (20–30 mm)",
      thickness: "20–30 mm",
      className: "filter-layer",
    },
    {
      number: "3",
      number: "3",
      name: "Geotextile layer",
      material: "woven geotextile",
      thickness: " along the stretch",
      className: "geotextile-layer",
    },
    {
      number: "4",
      name: "Base + subbase layer",
      material: "Open-graded aggregate (10–40 mm)",
      thickness: "300–450 mm",
      className: "base-layer",
    },
  ];

  return (
    <section className="pavement-section">
      <div className="section-heading">
        <div>
          <p className="section-label">PAVEMENT STRUCTURE</p>

          <h2>Multi-Layer Permeable Pavement</h2>

          <p>
            Water passes through multiple layers for filtration,
            storage and infiltration.
          </p>
        </div>
      </div>

      <div className="pavement-layout">

        {/* VISUAL STRUCTURE */}
        <div className="pavement-visual">

          <div className="water-flow">
            💧
            <span>↓</span>
            💧
            <span>↓</span>
            💧
          </div>

          <div className="layer-stack">
            {layers.map((layer) => (
              <div
                key={layer.number}
                className={`pavement-layer ${layer.className}`}
              >
                <div className="layer-number">
                  {layer.number}
                </div>

                <div className="layer-info">
                  <strong>{layer.name}</strong>
                  <span>{layer.thickness}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flow-arrow">
            ↓ Water Infiltration Flow ↓
          </div>

        </div>

        {/* LAYER DETAILS */}
        <div className="layer-details">

          <div className="layer-table-header">
            <span>Layer</span>
            <span>Material</span>
            <span>Thickness</span>
          </div>

          {layers.map((layer) => (
            <div className="layer-row" key={layer.number}>

              <div className="layer-name">
                <span className={`table-number ${layer.className}`}>
                  {layer.number}
                </span>

                <strong>{layer.name}</strong>
              </div>

              <span>{layer.material}</span>

              <strong>{layer.thickness}</strong>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default PavementLayers;