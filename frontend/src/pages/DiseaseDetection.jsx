import { useState } from "react";
import API from "../api/api";

import {
  UploadCloud,
  ShieldCheck,
  Search,
  Loader2,
  RotateCcw,
  ImageUp,
  Stethoscope,
  ShieldPlus,
} from "lucide-react";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const imageChangeHandler = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setImage(file);

    setPreview(URL.createObjectURL(file));

    setResult(null);
    setError("");
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please upload a plant leaf image first.");

      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", image);

      const [response] = await Promise.all([
        API.post("/disease/predict", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),

        sleep(1000),
      ]);

      setResult(response.data);
    } catch (error) {
      console.error("Disease prediction error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);

        setError(
          error.response.data?.detail
            ? JSON.stringify(error.response.data.detail)
            : "Disease prediction failed. Please check the uploaded image.",
        );
      } else if (error.request) {
        setError("Unable to connect to FastAPI backend.");
      } else {
        setError("Disease prediction failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLEAN DISEASE NAME
  // =====================================================

  const cleanDiseaseName = result?.display_name
    ? result.display_name
    : result?.predicted_class
      ? result.predicted_class.replaceAll("___", " ").replaceAll("_", " ")
      : "—";

  // =====================================================
  // CONFIDENCE
  // =====================================================

  const confidence =
    result?.confidence !== undefined && result?.confidence !== null
      ? Number(result.confidence)
      : 0;

  return (
    <main className="relative overflow-hidden px-5 py-12 lg:px-8">
      {/* BACKGROUND */}

      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-green-100 blur-3xl" />

      <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-purple-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-agriPurple">
              <ShieldCheck size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
                Disease Detection
              </h1>

              <p className="mt-2 max-w-3xl text-slate-600">
                Upload a plant leaf image to identify the disease and receive
                treatment and prevention guidance.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <form
            onSubmit={submitHandler}
            className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft"
          >
            {/* FORM HEADER */}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Upload Leaf Image
              </h2>

              <button
                type="button"
                onClick={resetImage}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-agriGreen hover:text-agriGreen"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            {/* =================================================
                UPLOAD BOX
            ================================================= */}

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-green-200 bg-green-50/50 px-6 py-12 text-center transition hover:border-agriGreen hover:bg-green-50">
              <UploadCloud size={44} className="mb-4 text-agriGreen" />

              <p className="mb-2 font-bold text-slate-800">
                Click to upload leaf image
              </p>

              <p className="mb-5 text-sm text-slate-500">
                JPG, PNG and JPEG image files are supported
              </p>

              <span className="inline-flex items-center gap-2 rounded-xl bg-agriGreen px-5 py-3 text-sm font-bold text-white">
                <ImageUp size={17} />
                Choose Image
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={imageChangeHandler}
                className="hidden"
              />
            </label>

            {/* =================================================
                PREVIEW
            ================================================= */}

            {preview && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                <img
                  src={preview}
                  alt="Uploaded leaf preview"
                  className="h-64 w-full object-cover sm:h-72"
                />
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-agriGreen py-4 font-bold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={19} />
                  Detecting Disease...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Detect Disease
                </>
              )}
            </button>
          </form>

          {/* =================================================
              RIGHT RESULT CARD
          ================================================= */}

          <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-7 shadow-soft sm:p-8">
            {loading ? (
              /* =================================================
                 LOADING STATE
              ================================================= */

              <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-agriPurple">
                  <Loader2 size={52} className="animate-spin" />
                </div>

                <p className="mb-3 font-bold text-agriPurple">
                  Analyzing Leaf Image
                </p>

                <h2 className="mb-5 text-3xl font-black text-agriPurple sm:text-4xl">
                  Please Wait...
                </h2>

                <p className="max-w-sm text-sm leading-6 text-slate-600">
                  The deep learning model is analyzing the uploaded image and
                  identifying the most likely plant condition.
                </p>

                <div className="mt-8 w-full max-w-sm rounded-3xl bg-white/80 p-5 shadow-sm">
                  <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-purple-100">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-agriPurple" />
                  </div>

                  <p className="text-sm font-semibold text-slate-600">
                    Processing image features...
                  </p>
                </div>
              </div>
            ) : result ? (
              /* =================================================
                 RESULT STATE
              ================================================= */

              <div>
                {/* RESULT HEADER */}

                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-agriPurple">
                    <ShieldCheck size={52} />
                  </div>

                  <p className="mb-2 text-sm font-black uppercase tracking-wide text-agriPurple">
                    Detected Disease
                  </p>

                  <h2 className="max-w-lg text-3xl font-black capitalize leading-tight text-agriPurple sm:text-4xl">
                    {cleanDiseaseName}
                  </h2>
                </div>

                {/* =================================================
                    CONFIDENCE
                ================================================= */}

                <div className="mt-7 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        Model Confidence
                      </p>

                      <p className="mt-1 text-3xl font-black text-agriPurple">
                        {confidence.toFixed(2)}%
                      </p>
                    </div>

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[7px] border-purple-200 bg-purple-50">
                      <span className="text-sm font-black text-agriPurple">
                        {Math.round(confidence)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-purple-100">
                    <div
                      className="h-full rounded-full bg-agriPurple transition-all duration-500"
                      style={{
                        width: `${Math.min(Math.max(confidence, 0), 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* =================================================
                    TREATMENT
                ================================================= */}

                <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                      <Stethoscope size={21} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-yellow-700">
                        Recommended Action
                      </p>

                      <h3 className="font-black text-slate-900">Treatment</h3>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    {result.treatment ||
                      "Specific treatment guidance is not available for this disease."}
                  </p>
                </div>

                {/* =================================================
                    PREVENTION
                ================================================= */}

                <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-agriGreen">
                      <ShieldPlus size={21} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                        Future Protection
                      </p>

                      <h3 className="font-black text-darkGreen">Prevention</h3>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    {result.prevention ||
                      "Maintain healthy planting material, proper irrigation and regular disease monitoring."}
                  </p>
                </div>

                {/* =================================================
                    NOTE
                ================================================= */}

                <div className="mt-5 rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm">
                  <h3 className="mb-2 font-bold text-slate-900">
                    Prediction Note
                  </h3>

                  <p className="text-sm leading-6 text-slate-600">
                    This disease prediction is generated by the trained deep
                    learning model. Treatment and prevention information is
                    advisory guidance. Confirm serious crop problems with a
                    qualified agricultural professional before applying
                    treatments.
                  </p>
                </div>
              </div>
            ) : (
              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-agriPurple">
                  <ShieldCheck size={52} />
                </div>

                <p className="mb-3 font-bold text-agriPurple">
                  Disease Analysis
                </p>

                <h2 className="mb-5 text-3xl font-black text-agriPurple sm:text-4xl">
                  Ready to Analyze
                </h2>

                <p className="max-w-sm text-sm leading-6 text-slate-600">
                  Upload a plant leaf image and click Detect Disease to view
                  disease, confidence, treatment and prevention information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default DiseaseDetection;
