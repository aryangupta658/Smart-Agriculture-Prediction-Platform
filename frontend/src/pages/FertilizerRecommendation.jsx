import { useState } from "react";
import API from "../api/api";

import {
  FlaskConical,
  Recycle,
  Loader2,
  RotateCcw,
  PackageCheck,
  Radio,
  Calculator,
  Wifi,
  Droplets,
} from "lucide-react";

function FertilizerIllustration() {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-yellow-100 bg-white shadow-sm">
      <img
        src="/images/agrifertilizercard.png"
        alt="Fertilizer recommendation field illustration"
        className="h-44 w-full object-cover sm:h-52"
      />
    </div>
  );
}

function FertilizerRecommendation() {
  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    Temperature: "",
    Humidity: "",
    Soil_Moisture: "",
    Soil_Type: "",
    Crop_Type: "",
    Nitrogen: "",
    Potassium: "",
    Phosphorus: "",
  });

  // =====================================================
  // RESULT / LOADING
  // =====================================================

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [sensorLoading, setSensorLoading] = useState(false);

  const [npkLoading, setNpkLoading] = useState(false);

  // =====================================================
  // EXTRA INFORMATION
  // =====================================================

  const [sensorPh, setSensorPh] = useState("");

  const [sensorInfo, setSensorInfo] = useState("");

  const [npkInfo, setNpkInfo] = useState("");

  const [error, setError] = useState("");

  // =====================================================
  // SOIL TYPES
  // =====================================================

  const soilTypes = [
    "Alluvial",
    "Black Soil",
    "Clay",
    "Clay Loam",
    "Loam",
    "Loamy",
    "Loamy Sand",
    "Red Clay Loam",
    "Red Loam",
    "Sand",
    "Sandy",
    "Sandy Loam",
    "Silty Loam",
  ];

  // =====================================================
  // CROP TYPES
  // =====================================================

  const cropTypes = [
    "Arhar/Tur",
    "Cotton (Lint)",
    "Cowpea (Lobia)",
    "Gram (Chickpea)",
    "Linseed (Flax)",
    "Maize (Fodder)",
    "Maize (Grain)",
    "Masoor (Red Lentil)",
    "Moong (Green Gram)",
    "Peas & Beans (Pulses)",
    "Ragi (Finger Millet)",
    "Rapeseed & Mustard",
    "Urad (Black Gram)",
  ];

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-agriGreen focus:ring-4 focus:ring-green-100";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // =====================================================
  // MANUAL INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setResult(null);
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setFormData({
      Temperature: "",
      Humidity: "",
      Soil_Moisture: "",
      Soil_Type: "",
      Crop_Type: "",
      Nitrogen: "",
      Potassium: "",
      Phosphorus: "",
    });

    setResult(null);

    setSensorPh("");

    setSensorInfo("");

    setNpkInfo("");

    setError("");
  };

  // =====================================================
  // LOAD ESP32 SENSOR DATA
  //
  // GET /iot/latest
  //
  // Fertilizer model uses:
  //
  // Temperature
  // Humidity
  // Soil_Moisture
  //
  // pH is not used by this ML model.
  // =====================================================

  const loadSensorData = async () => {
    setSensorLoading(true);

    setError("");

    setSensorInfo("");

    try {
      const response = await API.get("/iot/latest");

      const sensor = response.data;

      if (!sensor.available) {
        setError(sensor.message || "No ESP32 sensor reading is available yet.");

        return;
      }

      // Use sensor value only when it exists.
      //
      // Otherwise preserve current manual input.

      setFormData((previous) => ({
        ...previous,

        Temperature: sensor.temperature ?? previous.Temperature,

        Humidity: sensor.humidity ?? previous.Humidity,

        Soil_Moisture: sensor.soil_moisture ?? previous.Soil_Moisture,
      }));

      // pH is optional.
      //
      // It is displayed only because
      // fertilizer model does not use pH.

      if (sensor.ph !== null && sensor.ph !== undefined) {
        setSensorPh(sensor.ph);
      } else {
        setSensorPh("");
      }

      setSensorInfo(
        `Sensor values loaded successfully from ${
          sensor.device_id || "ESP32"
        }.`,
      );

      setResult(null);
    } catch (error) {
      console.error("Sensor loading error:", error);

      if (error.response) {
        setError(`Sensor request failed with status ${error.response.status}.`);
      } else if (error.request) {
        setError("Unable to connect to FastAPI backend.");
      } else {
        setError("Unable to load ESP32 sensor data.");
      }
    } finally {
      setSensorLoading(false);
    }
  };

  // =====================================================
  // NPK ESTIMATION
  // =====================================================

  const estimateNpk = async () => {
    if (!formData.Soil_Type) {
      setError("Please select Soil Type before estimating NPK.");

      return;
    }

    setNpkLoading(true);

    setError("");

    setNpkInfo("");

    try {
      const response = await API.get(
        `/npk/estimate/${encodeURIComponent(formData.Soil_Type)}`,
      );

      const data = response.data;

      if (data.error) {
        setError(data.error);

        return;
      }

      setFormData((previous) => ({
        ...previous,

        Nitrogen: data.nitrogen ?? previous.Nitrogen,

        Phosphorus: data.phosphorus ?? previous.Phosphorus,

        Potassium: data.potassium ?? previous.Potassium,
      }));

      setNpkInfo(
        data.reason ||
          "NPK values estimated successfully from selected soil type.",
      );

      setResult(null);
    } catch (error) {
      console.error("NPK estimation error:", error);

      if (error.response) {
        setError(`NPK estimation failed with status ${error.response.status}.`);
      } else if (error.request) {
        setError("Unable to connect to FastAPI backend for NPK estimation.");
      } else {
        setError("Unable to estimate NPK.");
      }
    } finally {
      setNpkLoading(false);
    }
  };

  // =====================================================
  // PREDICTION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setResult(null);

    setError("");

    try {
      const payload = {
        Temperature: Number(formData.Temperature),

        Humidity: Number(formData.Humidity),

        Soil_Moisture: Number(formData.Soil_Moisture),

        Soil_Type: formData.Soil_Type,

        Crop_Type: formData.Crop_Type,

        Nitrogen: Number(formData.Nitrogen),

        Potassium: Number(formData.Potassium),

        Phosphorus: Number(formData.Phosphorus),
      };

      console.log("Fertilizer payload:", payload);

      const [response] = await Promise.all([
        API.post("/fertilizer/predict", payload),

        sleep(900),
      ]);

      setResult(response.data);
    } catch (error) {
      console.error("Fertilizer prediction error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);

        setError(
          error.response.data?.detail
            ? JSON.stringify(error.response.data.detail)
            : "Fertilizer prediction failed. Please check your input values.",
        );
      } else if (error.request) {
        setError("Unable to connect to FastAPI backend.");
      } else {
        setError("Fertilizer prediction failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden px-5 py-12 lg:px-8">
      {/* BACKGROUND */}

      <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-yellow-100 blur-3xl" />

      <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-green-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <FlaskConical className="text-agriGreen" size={42} />

            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Fertilizer Recommendation
            </h1>
          </div>

          <p className="max-w-3xl text-slate-600">
            Enter values manually or load available environmental and soil
            readings from the ESP32. Nutrient values can also be estimated using
            the selected soil type.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft"
          >
            {/* HEADER */}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Enter Details
              </h2>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-agriGreen hover:text-agriGreen"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            {/* =================================================
                ESP32 SENSOR INPUT
            ================================================= */}

            <div className="mb-7 rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-agriGreen">
                  <Radio size={22} />
                </div>

                <div>
                  <h3 className="font-black text-darkGreen">
                    ESP32 Sensor Input
                  </h3>

                  <p className="text-xs text-slate-500">
                    Optional automatic input
                  </p>
                </div>
              </div>

              <p className="mb-4 text-sm leading-6 text-slate-600">
                Load available temperature, humidity and soil moisture readings
                from your ESP32. Manual values remain unchanged when a
                particular sensor is unavailable.
              </p>

              <button
                type="button"
                onClick={loadSensorData}
                disabled={sensorLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-agriGreen px-5 py-3 text-sm font-bold text-white shadow-md shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sensorLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Reading Sensors...
                  </>
                ) : (
                  <>
                    <Wifi size={18} />
                    Load Sensor Data
                  </>
                )}
              </button>

              {sensorInfo && (
                <div className="mt-4 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-semibold text-green-700">
                  {sensorInfo}
                </div>
              )}

              {sensorPh !== "" && (
                <div className="mt-3 flex gap-3 rounded-xl border border-green-100 bg-white px-4 py-3">
                  <Droplets
                    size={19}
                    className="mt-0.5 shrink-0 text-agriGreen"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Sensor pH: {sensorPh}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      pH is displayed only for information. Your current
                      fertilizer model was not trained using pH.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                ENVIRONMENTAL VALUES
            ================================================= */}

            <div className="mb-7">
              <h3 className="mb-4 text-base font-black text-slate-900">
                Environmental & Soil Conditions
              </h3>

              <div className="grid gap-5 sm:grid-cols-3">
                {/* Temperature */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Temperature (°C)
                  </label>

                  <input
                    name="Temperature"
                    type="number"
                    step="any"
                    className={inputClass}
                    value={formData.Temperature}
                    onChange={handleChange}
                    placeholder="26"
                    required
                  />
                </div>

                {/* Humidity */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Humidity (%)
                  </label>

                  <input
                    name="Humidity"
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    className={inputClass}
                    value={formData.Humidity}
                    onChange={handleChange}
                    placeholder="55"
                    required
                  />
                </div>

                {/* Soil Moisture */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Soil Moisture (%)
                  </label>

                  <input
                    name="Soil_Moisture"
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    className={inputClass}
                    value={formData.Soil_Moisture}
                    onChange={handleChange}
                    placeholder="25"
                    required
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                SOIL TYPE
            ================================================= */}

            <div className="mb-7">
              <h3 className="mb-4 text-base font-black text-slate-900">
                Soil & Crop Details
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Soil Type
                  </label>

                  <select
                    name="Soil_Type"
                    className={inputClass}
                    value={formData.Soil_Type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Soil Type</option>

                    {soilTypes.map((soil) => (
                      <option key={soil} value={soil}>
                        {soil}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Crop */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Crop Type
                  </label>

                  <select
                    name="Crop_Type"
                    className={inputClass}
                    value={formData.Crop_Type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Crop Type</option>

                    {cropTypes.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* =================================================
                NPK RULE CARD
            ================================================= */}

            <div className="mb-7 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <Calculator size={22} />
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Rule-Based NPK Estimation
                  </h3>

                  <p className="text-xs text-slate-500">
                    Alternative to an NPK sensor
                  </p>
                </div>
              </div>

              <p className="mb-4 text-sm leading-6 text-slate-600">
                Select Soil Type and click the button below to estimate
                Nitrogen, Phosphorus and Potassium. You can edit the values
                manually afterward.
              </p>

              <button
                type="button"
                onClick={estimateNpk}
                disabled={npkLoading || !formData.Soil_Type}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {npkLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Estimating NPK...
                  </>
                ) : (
                  <>
                    <Calculator size={18} />
                    Estimate NPK From Soil Type
                  </>
                )}
              </button>

              {!formData.Soil_Type && (
                <p className="mt-3 text-xs font-medium text-yellow-800">
                  Select Soil Type first.
                </p>
              )}

              {npkInfo && (
                <div className="mt-4 rounded-xl border border-yellow-200 bg-white px-4 py-3">
                  <p className="text-sm font-bold text-yellow-800">
                    Estimated NPK values loaded
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {npkInfo}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    These values are estimates and not laboratory soil
                    measurements.
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                NPK VALUES
            ================================================= */}

            <div>
              <h3 className="mb-4 text-base font-black text-slate-900">
                Nutrient Values
              </h3>

              <div className="grid gap-5 sm:grid-cols-3">
                {/* N */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Nitrogen (N)
                  </label>

                  <input
                    name="Nitrogen"
                    type="number"
                    step="any"
                    min="0"
                    className={inputClass}
                    value={formData.Nitrogen}
                    onChange={handleChange}
                    placeholder="40"
                    required
                  />
                </div>

                {/* P */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Phosphorus (P)
                  </label>

                  <input
                    name="Phosphorus"
                    type="number"
                    step="any"
                    min="0"
                    className={inputClass}
                    value={formData.Phosphorus}
                    onChange={handleChange}
                    placeholder="35"
                    required
                  />
                </div>

                {/* K */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Potassium (K)
                  </label>

                  <input
                    name="Potassium"
                    type="number"
                    step="any"
                    min="0"
                    className={inputClass}
                    value={formData.Potassium}
                    onChange={handleChange}
                    placeholder="30"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* PREDICT */}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-agriGreen py-4 font-bold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Nutrients...
                </>
              ) : (
                <>
                  <FlaskConical size={19} />
                  Get Recommendation
                </>
              )}
            </button>
          </form>

          {/* =================================================
              RESULT
          ================================================= */}

          <div className="overflow-hidden rounded-3xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-green-50 p-8 shadow-soft">
            {loading ? (
              <div className="flex h-full min-h-[430px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-agriGreen">
                  <Loader2 size={52} className="animate-spin" />
                </div>

                <h3 className="mb-3 text-xl font-black text-darkGreen">
                  Finding Fertilizer
                </h3>

                <p className="max-w-sm text-sm leading-6 text-slate-600">
                  Please wait while the model analyzes soil, crop and nutrient
                  values.
                </p>

                <FertilizerIllustration />
              </div>
            ) : result?.error ? (
              <div className="rounded-2xl bg-red-50 p-5 text-red-700">
                <h2 className="mb-2 text-xl font-black">Invalid Input</h2>

                <p className="text-sm leading-6">{result.error}</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-agriGreen">
                    <PackageCheck size={34} />
                  </div>

                  <div>
                    <p className="font-bold text-darkGreen">
                      Recommended Fertilizer
                    </p>

                    <h2 className="text-4xl font-black text-agriGreen">
                      {result?.recommended_fertilizer || "—"}
                    </h2>
                  </div>
                </div>

                <div className="my-6 h-px bg-green-200" />

                <div className="mb-6 flex gap-4">
                  <Recycle className="mt-1 shrink-0 text-agriGreen" />

                  <div>
                    <h3 className="mb-2 font-bold text-darkGreen">
                      Biodegradable Alternative
                    </h3>

                    <p className="text-sm leading-6 text-slate-700">
                      {result?.biodegradable_alternative ||
                        "Eco-friendly alternative will appear here after prediction."}
                    </p>
                  </div>
                </div>

                <div className="my-6 h-px bg-green-200" />

                <div>
                  <h3 className="mb-2 font-bold text-darkGreen">Reason</h3>

                  <p className="text-sm leading-6 text-slate-700">
                    {result?.reason ||
                      "Reason will appear here after fertilizer prediction."}
                  </p>
                </div>

                <FertilizerIllustration />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default FertilizerRecommendation;
