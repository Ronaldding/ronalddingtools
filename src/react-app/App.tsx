import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import NotFoundPage from "./Pages/NotFoundPage";
import QRCodePage from "./Pages/QRCodePage";
import CalculatorPage from "./Pages/CalculatorPage";
import KinshipPage from "./Pages/KinshipPage";
import RacingGame from "./Pages/RacingGame";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/qr-code" element={<QRCodePage />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/kinship" element={<KinshipPage />} />
      <Route path="/racing-game" element={<RacingGame />} />
      <Route path="*" element={<NotFoundPage />} />
      {/* The KinshipPage component is used for kinship calculations */}
    </Routes>
  );
}

export default App;