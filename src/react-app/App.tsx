import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import NotFoundPage from "./NotFoundPage";
import QRCodePage from "./QRCodePage/QRCodePage";
import CalculatorPage from "./CalculatorPage/CalculatorPage";
import KinshipPage from "./KinshipPage/KinshipPage";
import RacingGame from "./RacingGame/RacingGame";

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