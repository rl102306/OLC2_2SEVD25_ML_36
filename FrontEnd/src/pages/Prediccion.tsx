import { useState } from "react";
import Navbar from "../../src/components/Navbar";

const API_URL = "http://localhost:5000";

const Prediccion = () => {
  const [form, setForm] = useState({
    promedio_actual: "",
    asistencia_clases: "",
    tareas_entregadas: "",
    participacion_clase: "",
    horas_estudio: "",
    promedio_evaluaciones: "",
    cursos_reprobados: "",
    actividades_extracurriculares: "",
    reportes_disciplinarios: "",
  });

  const [resultado, setResultado] = useState<{
    probabilidad: number;
    riesgo: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const predecir = async () => {
    const payload = {
      promedio_actual: Number(form.promedio_actual),
      asistencia_clases: Number(form.asistencia_clases),
      tareas_entregadas: Number(form.tareas_entregadas),
      participacion_clase: Number(form.participacion_clase),
      horas_estudio: Number(form.horas_estudio),
      promedio_evaluaciones: Number(form.promedio_evaluaciones),
      cursos_reprobados: Number(form.cursos_reprobados),
      actividades_extracurriculares: Number(form.actividades_extracurriculares),
      reportes_disciplinarios: Number(form.reportes_disciplinarios),
    };

    try {
      const response = await fetch(`${API_URL}/predecir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en la predicción");
      }

      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "32px" }}>
        <h1>Predicción de Riesgo</h1>

        <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
          {/* FORMULARIO */}
          <div style={{ flex: 1 }}>
            
            <label>Promedio actual</label>
            <Input label="Promedio actual" name="promedio_actual" onChange={handleChange} />
            <label>Asistencia a clases</label>
            <Input label="Asistencia a clases" name="asistencia_clases" onChange={handleChange} />
            <label>Tareas entregadas</label>
            <Input label="Tareas entregadas" name="tareas_entregadas" onChange={handleChange} />
            <label>Participación en clase</label>
            <Input label="Participación en clase" name="participacion_clase" onChange={handleChange} />
            <label>Horas de estudio</label>
            <Input label="Horas de estudio" name="horas_estudio" onChange={handleChange} />
            <label>Promedio evaluaciones</label>
            <Input label="Promedio evaluaciones" name="promedio_evaluaciones" onChange={handleChange} />
            <label>Cursos reprobados</label>
            <Input label="Cursos reprobados" name="cursos_reprobados" onChange={handleChange} />
            <label>Actividades extracurriculares</label>
            <Input
              label="Actividades extracurriculares"
              name="actividades_extracurriculares"
              onChange={handleChange}
            />
           <label>Reportes disciplinarios</label>
            <Input
              label="Reportes disciplinarios"
              name="reportes_disciplinarios"
              onChange={handleChange}
            />

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button style={buttonStyle} onClick={predecir}>
                Predecir
              </button>
              <button style={cancelStyle}>Cancelar</button>
            </div>
          </div>

          {/* RESULTADO */}
          <div style={resultadoBox}>
            {resultado ? (
              <>
                <h2>{resultado.riesgo.toUpperCase()}</h2>
                <p style={{ fontSize: "48px", fontWeight: "bold" }}>
                  {(resultado.probabilidad * 100).toFixed(0)}%
                </p>
                <p>Probabilidad de riesgo</p>
              </>
            ) : (
              <p style={{ color: "#6b7280" }}>Resultado</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

const Input = ({
  label,
  name,
  onChange,
}: {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div style={{ marginBottom: "12px" }}>
    <input
      type="number"
      name={name}
      placeholder={label}
      onChange={onChange}
      style={inputStyle}
    />
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#374151",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelStyle = {
  padding: "10px 20px",
  backgroundColor: "#e5e7eb",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const resultadoBox = {
  width: "260px",
  height: "260px",
  border: "2px solid #9ca3af",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
};

export default Prediccion;
