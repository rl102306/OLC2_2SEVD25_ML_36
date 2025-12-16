import { BrowserRouter, Routes, Route } from "react-router-dom";
import CargaMasiva from "./pages/CargaMasiva";
import Ajuste from "./pages/Ajuste";
import Evaluacion from "./pages/Evaluacion";
import Prediccion from "./pages/Prediccion";


function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<CargaMasiva />} />
<Route path="/ajuste" element={<Ajuste />} />
<Route path="/evaluacion" element={<Evaluacion />} />
<Route path="/prediccion" element={<Prediccion />} />
</Routes>
</BrowserRouter>
);
}


export default App;