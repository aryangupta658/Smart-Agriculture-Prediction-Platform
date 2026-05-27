import { useState } from "react";
import API from "../api/api";
import { Sprout, Leaf, Loader2, RotateCcw } from "lucide-react";

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

function CropRecommendation() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    { name: "N", label: "Nitrogen (N)", placeholder: "90" },
    { name: "P", label: "Phosphorus (P)", placeholder: "42" },
    { name: "K", label: "Potassium (K)", placeholder: "43" },
    { name: "temperature", label: "Temperature (°C)", placeholder: "20.8" },
    { name: "humidity", label: "Humidity (%)", placeholder: "82" },
    { name: "ph", label: "pH", placeholder: "6.5" },
    { name: "rainfall", label: "Rainfall (mm)", placeholder: "202" },
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      N: "",
      P: "",
      K: "",
      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
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
        N: Number(formData.N),
        P: Number(formData.P),
        K: Number(formData.K),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall),
      };

      const [response] = await Promise.all([
        API.post("/crop/predict", payload),
        sleep(900),
      ]);

      setResult(response.data);
    } catch (error) {
      console.error(error);
      setError(
        "Crop prediction failed. Please check that FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const cropName =
    result?.recommended_crop || result?.crop || result?.prediction || "";

  return (
    <main className="relative overflow-hidden px-5 py-12 lg:px-8">
      <div className="absolute left-0 top-32 h-80 w-80 rounded-full bg-green-100 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-lime-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <Sprout className="text-agriGreen" size={42} />
            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Crop Recommendation
            </h1>
          </div>

          <p className="text-slate-600">
            Enter soil and weather details to get the best crop recommendation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
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

            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {field.label}
                  </label>

                  <input
                    type="number"
                    step="any"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-agriGreen focus:ring-4 focus:ring-green-100"
                  />
                </div>
              ))}
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
                  Analyzing Soil Data...
                </>
              ) : (
                <>🌱 Recommend Crop</>
              )}
            </button>
          </form>

          <div className="overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-8 shadow-soft">
            <div className="flex h-full min-h-[430px] flex-col items-center justify-center text-center">
              {loading ? (
                <>
                  <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-green-100 text-agriGreen">
                    <Loader2 size={56} className="animate-spin" />
                  </div>

                  <h3 className="mb-3 text-xl font-black text-darkGreen">
                    Finding Best Crop
                  </h3>

                  <p className="max-w-sm text-sm leading-6 text-slate-600">
                    Please wait while the model analyzes soil nutrients and
                    environmental conditions.
                  </p>

                  <CropIllustration />
                </>
              ) : (
                <>
                  <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-green-100 text-agriGreen">
                    <Leaf size={58} fill="currentColor" />
                  </div>

                  <h3 className="mb-4 text-lg font-bold text-darkGreen">
                    Recommended Crop
                  </h3>

                  <h2 className="mb-4 text-5xl font-black capitalize text-agriGreen">
                    {cropName || "—"}
                  </h2>

                  <p className="max-w-sm text-sm leading-6 text-slate-600">
                    {cropName
                      ? "This crop is best suited for the given soil and environmental conditions."
                      : "Your crop recommendation result will appear here after prediction."}
                  </p>

                  <CropIllustration />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CropRecommendation;
