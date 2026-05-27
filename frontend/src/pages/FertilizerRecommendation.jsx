import { useState } from "react";
import API from "../api/api";
import {
  FlaskConical,
  Recycle,
  Loader2,
  RotateCcw,
  PackageCheck,
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

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    setError("");
  };

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

      const [response] = await Promise.all([
        API.post("/fertilizer/predict", payload),
        sleep(900),
      ]);

      setResult(response.data);
    } catch (error) {
      console.error(error);
      setError(
        "Fertilizer prediction failed. Please check backend and dropdown values."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden px-5 py-12 lg:px-8">
      <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-yellow-100 blur-3xl" />
      <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-green-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <FlaskConical className="text-agriGreen" size={42} />

            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Fertilizer Recommendation
            </h1>
          </div>

          <p className="text-slate-600">
            Enter soil, crop and nutrient details to get fertilizer suggestions.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft"
          >
            <div className="mb-6 flex items-center justify-between">
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

            <div className="grid gap-5 sm:grid-cols-3">
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

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Humidity (%)
                </label>

                <input
                  name="Humidity"
                  type="number"
                  step="any"
                  className={inputClass}
                  value={formData.Humidity}
                  onChange={handleChange}
                  placeholder="55"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Soil Moisture (%)
                </label>

                <input
                  name="Soil_Moisture"
                  type="number"
                  step="any"
                  className={inputClass}
                  value={formData.Soil_Moisture}
                  onChange={handleChange}
                  placeholder="25"
                  required
                />
              </div>

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

              <div className="sm:col-span-2">
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

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Nitrogen (N)
                </label>

                <input
                  name="Nitrogen"
                  type="number"
                  step="any"
                  className={inputClass}
                  value={formData.Nitrogen}
                  onChange={handleChange}
                  placeholder="40"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Potassium (K)
                </label>

                <input
                  name="Potassium"
                  type="number"
                  step="any"
                  className={inputClass}
                  value={formData.Potassium}
                  onChange={handleChange}
                  placeholder="30"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Phosphorus (P)
                </label>

                <input
                  name="Phosphorus"
                  type="number"
                  step="any"
                  className={inputClass}
                  value={formData.Phosphorus}
                  onChange={handleChange}
                  placeholder="35"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

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
                <>🌿 Get Recommendation</>
              )}
            </button>
          </form>

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
                  Please wait while the model analyzes soil, crop, and nutrient
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
