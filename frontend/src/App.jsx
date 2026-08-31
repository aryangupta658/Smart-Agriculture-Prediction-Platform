import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CropRecommendation from "./pages/CropRecommendation";
import FertilizerRecommendation from "./pages/FertilizerRecommendation";
import DiseaseDetection from "./pages/DiseaseDetection";
import SensorReadings from "./pages/SensorReadings";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/crop" element={<CropRecommendation />} />

        <Route path="/fertilizer" element={<FertilizerRecommendation />} />

        <Route path="/disease" element={<DiseaseDetection />} />

        <Route path="/sensors" element={<SensorReadings />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
