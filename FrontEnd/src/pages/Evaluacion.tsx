import Navbar from "../../src/components/Navbar";

const Evaluacion = () => {

  const data = sessionStorage.getItem("metricasModelo");

  if (!data) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>
          No hay métricas para mostrar. Entrena el modelo primero.
        </p>
      </>
    );
  }
  const { metricas, modelo } = JSON.parse(data);

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>📊 Evaluación del Modelo</h2>
        <p>
          <b>Modelo:</b> {modelo}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "20px",
            maxWidth: "500px",
          }}
        >
          <div style={cardStyle}>
            <h4>Exactitud</h4>
            <p>{metricas.exactitud}</p>
          </div>

          <div style={cardStyle}>
            <h4>F1 Score</h4>
            <p>{metricas.f1_score}</p>
          </div>

          <div style={cardStyle}>
            <h4>Precisión</h4>
            <p>{metricas.precision}</p>
          </div>

          <div style={cardStyle}>
            <h4>Recall</h4>
            <p>{metricas.recall}</p>
          </div>
        </div>
      </div>
    </>
  );
};  


const cardStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
};

export default Evaluacion;