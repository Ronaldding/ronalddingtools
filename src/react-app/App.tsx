import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import NotFoundPage from "./NotFoundPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;