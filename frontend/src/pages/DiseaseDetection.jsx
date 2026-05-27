import { useState } from "react";
import API from "../api/api";
import {
  UploadCloud,
  ShieldCheck,
  Search,
  Loader2,
  RotateCcw,
  ImageUp,
} from "lucide-react";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const imageChangeHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const resetImage = () => {
    setImage(null);
    setPreview("");
    setResult(null);
    setError("");
  };

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
      console.error(error);
      setError(
        "Disease prediction failed. Please check that FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const cleanDiseaseName = result?.predicted_class
    ? result.predicted_class.replaceAll("_", " ")
    : "—";

  return (
    <main className="relative overflow-hidden px-5 py-12 lg:px-8">
      <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-green-100 blur-3xl" />
      <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-purple-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-agriPurple">
              <ShieldCheck size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
                Disease Detection
              </h1>
              <p className="mt-2 text-slate-600">
                Upload a plant leaf image to detect disease instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT FORM */}
          <form
            onSubmit={submitHandler}
            className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft"
          >
            <div className="mb-6 flex items-center justify-between">
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

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-green-200 bg-green-50/50 px-6 py-12 text-center transition hover:bg-green-50">
              <UploadCloud size={44} className="mb-4 text-agriGreen" />

              <p className="mb-2 font-bold text-slate-800">
                Click to upload leaf image
              </p>

              <p className="mb-5 text-sm text-slate-500">
                JPG, PNG, JPEG image files are supported
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

            {preview && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                <img
                  src={preview}
                  alt="Leaf preview"
                  className="h-64 w-full object-cover sm:h-72"
                />
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

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

          {/* RIGHT RESULT CARD */}
          <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-8 shadow-soft">
            <div className="flex h-full min-h-[520px] flex-col items-center justify-center text-center">
              {loading ? (
                <>
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
                    The model is checking the uploaded leaf image and preparing
                    disease prediction.
                  </p>

                  <div className="mt-8 w-full max-w-sm rounded-3xl bg-white/80 p-5 shadow-sm">
                    <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-purple-100">
                      <div className="h-full w-2/3 animate-pulse rounded-full bg-agriPurple" />
                    </div>

                    <p className="text-sm font-semibold text-slate-600">
                      Processing image features...
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-agriPurple">
                    <ShieldCheck size={52} />
                  </div>

                  <p className="mb-3 font-bold text-agriPurple">
                    Detected Disease
                  </p>

                  <h2 className="mb-8 text-3xl font-black text-agriPurple sm:text-4xl">
                    {cleanDiseaseName}
                  </h2>

                  <p className="mb-4 text-sm font-bold text-slate-600">
                    Confidence
                  </p>

                  <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-purple-300 bg-white shadow">
                    <span className="text-2xl font-black text-agriPurple">
                      {result?.confidence ? `${result.confidence}%` : "0%"}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-5 text-left shadow-sm">
                    <h3 className="mb-2 font-bold text-slate-900">
                      Prediction Note
                    </h3>

                    <p className="text-sm leading-6 text-slate-600">
                      {result
                        ? "This result is generated by your trained deep learning model. Use it for early monitoring, and consult an agricultural expert before final treatment decisions."
                        : "Disease prediction details will appear here after uploading a plant leaf image."}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DiseaseDetection;
