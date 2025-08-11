import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import NotFoundPage from "./Pages/NotFoundPage";
import QRCodePage from "./Pages/QRCodePage";
import CalculatorPage from "./Pages/CalculatorPage";
import KinshipPage from "./Pages/KinshipPage";
import RacingGame from "./Pages/RacingGame";
import ToolsPage from "./Pages/ToolsPage";
import GamesPage from "./Pages/GamesPage";
import ArticlesPage from "./Pages/ArticlesPage";
import Article from "./Pages/Article";
import AISummarizerPage from "./Pages/AISummarizerPage";
import ChequeConverterPage from "./Pages/ChequeConverterPage";
import BillGatesMoneyPage from "./Pages/BillGatesMoneyPage";
import ChatbotPage from "./Pages/Chatbot";
import { useEffect } from "react";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/qr-code" element={<QRCodePage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/kinship" element={<KinshipPage />} />
        <Route path="/racing-game" element={<RacingGame />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/article" element={<Article />} />
                              <Route path="/ai-summarizer" element={<AISummarizerPage />} />
                      <Route path="/cheque-converter" element={<ChequeConverterPage />} />
                      <Route path="/bill-gates-money" element={<BillGatesMoneyPage />} />
                      <Route path="/chatbot" element={<ChatbotPage />} />
                      <Route path="/article/id/:id/*" element={<Article />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* The KinshipPage component is used for kinship calculations */}
      </Routes>
    </>
  );
}

export default App;