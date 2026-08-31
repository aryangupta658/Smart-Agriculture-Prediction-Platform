import { useState } from "react";
import API from "../api/api";

import {
  Sprout,
  Leaf,
  Loader2,
  RotateCcw,
  Radio,
  Calculator,
  Wifi,
  Droplets,
  FlaskConical,
  RefreshCcw,
  Award,
  Info,
} from "lucide-react";

function CropIllustration() {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
      <img
        src="/images/agricropcard.png"
        alt="Crop recommendation field illustration"
        className="h-44 w-full object-cover sm:h-52"
      />
    </div>
  );
}

// =====================================================
// REUSABLE CROP RESULT CARD
// =====================================================

function CropResultCard({ item, label, best = false }) {
  if (!item) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        best ? "border-green-200" : "border-slate-100"
      }`}
    >
      {/* ===============================================
          CROP HEADER
      =============================================== */}

      <div className="mb-4">
        <div className="mb-1 flex items-center gap-2">
          {best && <Award size={16} className="text-agriGreen" />}

          <p
            className={`text-xs font-black uppercase tracking-wide ${
              best ? "text-agriGreen" : "text-slate-400"
            }`}
          >
            {label}
          </p>
        </div>

        <h2
          className={`font-black capitalize ${
            best ? "text-3xl text-darkGreen" : "text-2xl text-slate-900"
          }`}
        >
          {item.crop}
        </h2>
      </div>

      {/* ===============================================
          SUMMARY
      =============================================== */}

      {item.rotation_summary && (
        <div className="mb-4 rounded-xl bg-green-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            {item.rotation_summary}
          </p>
        </div>
      )}

      {/* ===============================================
          ROTATION BENEFITS
      =============================================== */}

      <div className="border-t border-slate-100 pt-4">
        <div className="mb-4 flex items-center gap-2">
          <RefreshCcw size={17} className="text-agriGreen" />

          <h3 className="text-sm font-black text-darkGreen">
            Rotation & Soil Benefits
          </h3>
        </div>

        {item.rotation?.length > 0 ? (
          <div className="space-y-3">
            {item.rotation.map((rotationItem, index) => (
              <div
                key={`${rotationItem.crop}-${index}`}
                className="rounded-xl border border-green-100 bg-green-50/60 p-4"
              >
                {/* CROP NAME */}

                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-agriGreen shadow-sm">
                    {index + 1}
                  </span>

                  <h4 className="font-black capitalize text-darkGreen">
                    {rotationItem.crop}
                  </h4>
                </div>

                {/* REASON */}

                <p className="text-xs leading-5 text-slate-600">
                  {rotationItem.reason}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Rotation guidance is not available for this crop.
          </p>
        )}
      </div>
    </div>
  );
}

function CropRecommendation() {
  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    soilType: "",

    N: "",
    P: "",
    K: "",

    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  // =====================================================
  // RESULT / LOADING
  // =====================================================

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [sensorLoading, setSensorLoading] = useState(false);

  const [npkLoading, setNpkLoading] = useState(false);

  // =====================================================
  // SENSOR INFORMATION
  // =====================================================

  const [sensorMoisture, setSensorMoisture] = useState("");

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
  // INPUT STYLE
  // =====================================================

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-agriGreen focus:ring-4 focus:ring-green-100";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // =====================================================
  // HANDLE INPUT CHANGE
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
  // LOAD ESP32 SENSOR DATA
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

      setFormData((previous) => ({
        ...previous,

        temperature: sensor.temperature ?? previous.temperature,

        humidity: sensor.humidity ?? previous.humidity,

        ph: sensor.ph ?? previous.ph,
      }));

      if (sensor.soil_moisture !== null && sensor.soil_moisture !== undefined) {
        setSensorMoisture(sensor.soil_moisture);
      } else {
        setSensorMoisture("");
      }

      setSensorInfo(
        `Sensor values loaded from ${sensor.device_id || "ESP32"}.`,
      );

      setResult(null);
    } catch (error) {
      console.error("Sensor loading error:", error);

      if (error.response) {
        setError(
          `Sensor data request failed with status ${error.response.status}.`,
        );
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
    if (!formData.soilType) {
      setError("Please select Soil Type before estimating NPK.");

      return;
    }

    setNpkLoading(true);

    setError("");
    setNpkInfo("");

    try {
      const response = await API.get(
        `/npk/estimate/${encodeURIComponent(formData.soilType)}`,
      );

      const data = response.data;

      if (data.error) {
        setError(data.error);

        return;
      }

      setFormData((previous) => ({
        ...previous,

        N: data.nitrogen ?? previous.N,

        P: data.phosphorus ?? previous.P,

        K: data.potassium ?? previous.K,
      }));

      setNpkInfo(
        data.reason ||
          "Estimated NPK values loaded using the selected soil type.",
      );

      setResult(null);
    } catch (error) {
      console.error("NPK estimation error:", error);

      if (error.response) {
        setError(`NPK estimation failed with status ${error.response.status}.`);
      } else if (error.request) {
        setError("Unable to connect to the backend for NPK estimation.");
      } else {
        setError("Unable to estimate NPK.");
      }
    } finally {
      setNpkLoading(false);
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setFormData({
      soilType: "",

      N: "",
      P: "",
      K: "",

      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
    });

    setSensorMoisture("");

    setSensorInfo("");

    setNpkInfo("");

    setResult(null);

    setError("");
  };

  // =====================================================
  // CROP PREDICTION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setResult(null);

    setError("");

    try {
      const payload = {
        N: Number(formData.N),

        P: Number(formData.P),

        K: Number(formData.K),

        temperature: Number(formData.temperature),

        humidity: Number(formData.humidity),

        ph: Number(formData.ph),

        rainfall: Number(formData.rainfall),
      };

      console.log("Crop prediction payload:", payload);

      const [response] = await Promise.all([
        API.post("/crop/predict", payload),

        sleep(900),
      ]);

      setResult(response.data);
    } catch (error) {
      console.error("Crop prediction error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);

        setError(
          error.response.data?.detail
            ? JSON.stringify(error.response.data.detail)
            : "Crop prediction failed. Check your input values.",
        );
      } else if (error.request) {
        setError("Unable to connect to FastAPI backend.");
      } else {
        setError("Crop prediction failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESULT DATA
  // =====================================================

  const bestMatch = result?.best_match || null;

  const alternatives = result?.alternatives || [];

  const oldCropName =
    result?.recommended_crop || result?.crop || result?.prediction || "";

  return (
    <main className="relative overflow-hidden px-5 py-12 lg:px-8">
      {/* BACKGROUND */}

      <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-green-100 blur-3xl" />

      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-yellow-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <Sprout className="text-agriGreen" size={42} />

            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Crop Recommendation
            </h1>
          </div>

          <p className="max-w-3xl text-slate-600">
            Enter agricultural values manually or automatically load available
            environmental readings from your ESP32 sensors.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* =================================================
              LEFT FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft"
          >
            {/* FORM HEADER */}

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
                ESP32
            ================================================= */}

            <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-5">
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
                Load available temperature, humidity and pH readings from the
                ESP32. Missing sensor values will not replace values entered
                manually.
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

              {sensorMoisture !== "" && (
                <div className="mt-3 flex gap-3 rounded-xl border border-green-100 bg-white px-4 py-3">
                  <Droplets
                    size={19}
                    className="mt-0.5 shrink-0 text-agriGreen"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Soil Moisture: {sensorMoisture}%
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      This value is displayed for information only. The current
                      crop model was not trained using soil moisture.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                NPK
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
                Select a soil type and estimate N, P and K values. You can edit
                the estimated values manually before prediction.
              </p>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <select
                  name="soilType"
                  className={inputClass}
                  value={formData.soilType}
                  onChange={handleChange}
                >
                  <option value="">Select Soil Type</option>

                  {soilTypes.map((soil) => (
                    <option key={soil} value={soil}>
                      {soil}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={estimateNpk}
                  disabled={npkLoading || !formData.soilType}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {npkLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Estimating...
                    </>
                  ) : (
                    <>
                      <Calculator size={18} />
                      Estimate NPK
                    </>
                  )}
                </button>
              </div>

              {!formData.soilType && (
                <p className="mt-3 text-xs font-medium text-yellow-800">
                  Select Soil Type to enable NPK estimation.
                </p>
              )}

              {npkInfo && (
                <div className="mt-4 rounded-xl border border-yellow-200 bg-white px-4 py-3">
                  <p className="text-sm font-bold text-yellow-800">
                    Estimated NPK loaded
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {npkInfo}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Estimated values are not laboratory soil-test measurements.
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                NUTRIENTS
            ================================================= */}

            <div className="mb-7">
              <div className="mb-4 flex items-center gap-2">
                <FlaskConical size={20} className="text-agriGreen" />

                <h3 className="font-black text-slate-900">Nutrient Values</h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Nitrogen (N)
                  </label>

                  <input
                    name="N"
                    type="number"
                    step="any"
                    min="0"
                    className={inputClass}
                    value={formData.N}
                    onChange={handleChange}
                    placeholder="90"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Phosphorus (P)
                  </label>

                  <input
                    name="P"
                    type="number"
                    step="any"
                    min="0"
                    className={inputClass}
                    value={formData.P}
                    onChange={handleChange}
                    placeholder="42"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Potassium (K)
                  </label>

                  <input
                    name="K"
                    type="number"
                    step="any"
                    min="0"
                    className={inputClass}
                    value={formData.K}
                    onChange={handleChange}
                    placeholder="43"
                    required
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                ENVIRONMENTAL
            ================================================= */}

            <div>
              <h3 className="mb-4 font-black text-slate-900">
                Environmental & Soil Conditions
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Temperature (°C)
                  </label>

                  <input
                    name="temperature"
                    type="number"
                    step="any"
                    className={inputClass}
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="20.8"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Humidity (%)
                  </label>

                  <input
                    name="humidity"
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    className={inputClass}
                    value={formData.humidity}
                    onChange={handleChange}
                    placeholder="82"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Soil pH
                  </label>

                  <input
                    name="ph"
                    type="number"
                    step="any"
                    min="0"
                    max="14"
                    className={inputClass}
                    value={formData.ph}
                    onChange={handleChange}
                    placeholder="6.5"
                    required
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Enter manually when the pH sensor is unavailable.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Rainfall (mm)
                  </label>

                  <input
                    name="rainfall"
                    type="number"
                    step="any"
                    min="0"
                    className={inputClass}
                    value={formData.rainfall}
                    onChange={handleChange}
                    placeholder="202"
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

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-agriGreen py-4 font-bold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Soil Data...
                </>
              ) : (
                <>
                  <Sprout size={20} />
                  Recommend Crop
                </>
              )}
            </button>
          </form>

          {/* =================================================
              RIGHT RESULT
          ================================================= */}

          <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-soft">
            {loading ? (
              /* LOADING */

              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-agriGreen">
                  <Loader2 size={52} className="animate-spin" />
                </div>

                <h3 className="mb-3 text-xl font-black text-darkGreen">
                  Finding Best Crops
                </h3>

                <p className="max-w-sm text-sm leading-6 text-slate-600">
                  Please wait while the model analyzes nutrient and
                  environmental conditions.
                </p>

                <CropIllustration />
              </div>
            ) : result?.error ? (
              /* ERROR RESPONSE */

              <div className="rounded-2xl bg-red-50 p-5 text-red-700">
                <h2 className="mb-2 text-xl font-black">Invalid Input</h2>

                <p className="text-sm leading-6">{result.error}</p>
              </div>
            ) : bestMatch ? (
              /* NEW RESULT */

              <div>
                {/* BEST MATCH */}

                <CropResultCard item={bestMatch} label="Best Match" best />

                {/* ALTERNATIVES */}

                {alternatives.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-4 text-lg font-black text-slate-900">
                      Alternative Crops
                    </h3>

                    <div className="space-y-5">
                      {alternatives.map((item, index) => (
                        <CropResultCard
                          key={`${item.crop}-${index}`}
                          item={item}
                          label={`Alternative ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* NOTE */}

                <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Info size={18} className="text-agriGreen" />

                    <h3 className="font-bold text-slate-900">
                      Recommendation Note
                    </h3>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    Crop ranking is generated by the trained Random Forest
                    model. Rotation and soil benefit information is rule-based
                    agronomic guidance. Final crop selection should also
                    consider season, irrigation, local climate, actual soil
                    testing and local agricultural recommendations.
                  </p>
                </div>

                <CropIllustration />
              </div>
            ) : oldCropName ? (
              /* OLD BACKEND SUPPORT */

              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-agriGreen">
                    <Leaf size={34} fill="currentColor" />
                  </div>

                  <div>
                    <p className="font-bold text-darkGreen">Recommended Crop</p>

                    <h2 className="text-4xl font-black capitalize text-agriGreen">
                      {oldCropName}
                    </h2>
                  </div>
                </div>

                <div className="my-6 h-px bg-green-200" />

                <p className="text-sm leading-6 text-slate-700">
                  {oldCropName} is recommended based on the supplied nutrient
                  and environmental conditions.
                </p>

                <CropIllustration />
              </div>
            ) : (
              /* EMPTY */

              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-agriGreen">
                  <Leaf size={52} fill="currentColor" />
                </div>

                <p className="mb-3 font-bold text-agriGreen">Crop Analysis</p>

                <h2 className="mb-5 text-3xl font-black text-darkGreen">
                  Ready to Recommend
                </h2>

                <p className="max-w-sm text-sm leading-6 text-slate-600">
                  Enter agricultural conditions and click Recommend Crop to view
                  the best crop, alternatives and crop-rotation guidance.
                </p>

                <CropIllustration />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CropRecommendation;
