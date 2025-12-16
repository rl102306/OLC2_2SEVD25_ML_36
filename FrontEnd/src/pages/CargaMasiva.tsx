import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";



const API_URL = "http://localhost:5000";

const CargaMasiva = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const subirArchivo = async () => {
    if (!file) {
      setMessage("⚠️ Seleccione un archivo CSV");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

   try {
  setLoading(true);
  setMessage(null);

  const response = await fetch(`${API_URL}/carga-masiva`, {
    method: "POST",
    body: formData,
  });

  // ⛔ fetch NO entra al catch por status 400/500
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  const data = await response.json(); // si tu backend devuelve JSON
  console.log("Respuesta backend:", data);
  
const container = document.getElementById("resultado-carga");
if (!container) return;

// limpiar contenido previo
container.innerHTML = "";

/* ===== TÍTULO ===== */
const h3 = document.createElement("h3");
h3.textContent = "Resultado de la carga";
container.appendChild(h3);

/* ===== MENSAJE ===== */
const pMsg = document.createElement("p");
pMsg.innerHTML = `<b>Mensaje:</b> ${data.mensaje}`;
container.appendChild(pMsg);

/* ===== FILAS ===== */
const pFilas = document.createElement("p");
pFilas.innerHTML = `<b>Filas:</b> ${data.filas}`;
container.appendChild(pFilas);

/* ===== COLUMNAS ===== */
const pCols = document.createElement("p");
pCols.innerHTML = `<b>Columnas:</b> ${data.columnas}`;
container.appendChild(pCols);

/* ===== LISTA DE COLUMNAS ===== */
const h4Cols = document.createElement("h4");
h4Cols.textContent = "Columnas";
container.appendChild(h4Cols);

const ulCols = document.createElement("ul");

data.columnas_nombres.forEach((c: string) => {
  const li = document.createElement("li");
  li.textContent = c;
  ulCols.appendChild(li);
});

container.appendChild(ulCols);

/* ===== RESUMEN DE LIMPIEZA ===== */
const h4Resumen = document.createElement("h4");
h4Resumen.textContent = "Resumen de limpieza";
container.appendChild(h4Resumen);

// duplicados eliminados
const pDuplicados = document.createElement("p");
pDuplicados.innerHTML = `<b>Duplicados eliminados:</b> ${data.resumen_limpieza.duplicados_eliminados}`;
container.appendChild(pDuplicados);

// nulos manejados
const pNulos = document.createElement("p");
const nulos = data.resumen_limpieza.nulos_manejados;

if (Object.keys(nulos).length === 0) {
  pNulos.innerHTML = `<b>Nulos manejados:</b> No se encontraron valores nulos`;
} else {
  pNulos.innerHTML = `<b>Nulos manejados:</b>`;
  const ulNulos = document.createElement("ul");

  Object.entries(nulos).forEach(([col, val]) => {
    const li = document.createElement("li");
    li.textContent = `${col}: ${val}`;
    ulNulos.appendChild(li);
  });

  container.appendChild(pNulos);
  container.appendChild(ulNulos);
  return;
}

container.appendChild(pNulos);



  setMessage("✅ Archivo cargado correctamente");
} catch (error: any) {
  console.error("Error fetch:", error);

  setMessage(
    `❌ Error al subir archivo: ${error.message || "Error desconocido"}`
  );
} finally {
  setLoading(false);
}
  };

  const limpiarDatos = async () => {
    try {
      setLoading(true);
      setMessage(null);

      await fetch(`${API_URL}/clean`, { method: "POST" });
      setMessage("🧹 Datos limpiados correctamente");
    } catch {
      setMessage("❌ Error al limpiar datos");
    } finally {
      setLoading(false);
    }
  };

  const entrenarModelo = async () => {
   try {
    
    setLoading(true);
    setMessage(null);

    const response = await fetch(`${API_URL}/entrenar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelo: "random_forest",
      }),
    });

    if (!response.ok) {
      throw new Error("Error al entrenar el modelo");
    }

    const data = await response.json();
    console.log("Respuesta entrenamiento:", data);

    // ✅ Mostrar mensaje
 
    setPopupMessage(data.mensaje);
    setShowPopup(true);

    // ✅ Guardar métricas para Evaluación
    sessionStorage.setItem(
      "metricasModelo",
      JSON.stringify({
        metricas: data.metricas,
        modelo: data.modelo,
      })
    );

  } catch (error: any) {
    console.error("Error entrenamiento:", error);
    setMessage("❌ Error al entrenar modelo");
  } finally {
    setLoading(false);
  }
  };

 return (
    <>
      <Navbar />

      <main style={{ padding: "40px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "30px" }}>Carga Masiva</h1>

        <div style={{ display: "flex", gap: "80px", alignItems: "center" }}>
          <label style={uploadStyle}>
            <span style={{ fontSize: "48px" }}>☁️</span>
            <p style={{ marginTop: "12px", fontWeight: 500 }}>
              {file ? file.name : "Subir archivo CSV"}
            </p>
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <button onClick={subirArchivo} disabled={loading} style={buttonStyle}>
              ⬆️ Subir archivo
            </button>
            <button onClick={limpiarDatos} disabled={loading} style={buttonStyle}>
              🧹 Limpiar datos
            </button>
            <button onClick={entrenarModelo} disabled={loading} style={buttonStyle}>
              🤖 Entrenar modelo
            </button>
          </div>
        </div>

        <div id="resultado-carga"></div>

        {message && <p style={{ marginTop: "30px", fontWeight: 500 }}>{message}</p>}
      </main>

      {/* ✅ POPUP */}
      {showPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h3>🤖 Entrenamiento</h3>
            <p style={{ margin: "15px 0" }}>{popupMessage}</p>
            <button style={buttonStyle} onClick={() => setShowPopup(false)}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const buttonStyle = {
  padding: "14px 24px",
  fontSize: "15px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#374151",
  color: "white",
  cursor: "pointer",
};

const uploadStyle = {
  width: "260px",
  height: "260px",
  border: "2px dashed #9ca3af",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "#ffffff",
};

const overlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "10px",
  minWidth: "320px",
  textAlign: "center" as const,
};

export default CargaMasiva;
