import { Link } from "react-router-dom";

import {
  Sprout,
  FlaskConical,
  SearchCheck,
  Play,
  ShieldCheck,
  Recycle,
  Leaf,
} from "lucide-react";

import FeatureCard from "../components/FeatureCard";

function Home() {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main>
      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden">
        {/* Background glow */}

        <div className="absolute left-0 top-40 h-72 w-72 rounded-full bg-green-100 blur-3xl" />

        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-sky-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
          {/* =================================================
              LEFT HERO CONTENT
          ================================================= */}

          <div>
            {/* Badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2 text-sm font-bold text-agriGreen">
              <Sprout size={17} />
              ML Powered Agriculture
            </div>

            {/* Main heading */}

            <h1 className="mb-6 text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Smart Decisions For
              <br />
              Better <span className="text-agriGreen">Farming</span>
              <span className="ml-2 inline-block">🌿</span>
            </h1>

            {/* Description */}

            <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
              Get machine-learning-based recommendations for crops and
              fertilizers, biodegradable alternatives, and plant disease
              detection using deep learning image analysis.
            </p>

            {/* Buttons */}

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/crop"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-agriGreen px-7 py-4 font-bold text-white shadow-lg shadow-green-200 transition hover:bg-green-700"
              >
                Explore Features →
              </Link>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-agriGreen px-7 py-4 font-bold text-slate-800 transition hover:bg-green-50"
              >
                <Play size={18} />
                How It Works
              </button>
            </div>
          </div>

          {/* =================================================
              RIGHT HERO IMAGE
          ================================================= */}

          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[620px]">
              <img
                src="/images/farm-hero.png"
                alt="Smart agriculture farmer illustration"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        {/* Heading */}

        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-extrabold uppercase tracking-widest text-agriGreen">
            Our Features
          </p>

          <h2 className="text-3xl font-black text-slate-950 md:text-4xl">
            Everything You Need For Smarter Agriculture
          </h2>

          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-agriGreen" />
        </div>

        {/* Feature cards */}

        <div className="grid gap-8 md:grid-cols-3">
          {/* Crop */}

          <FeatureCard
            icon={<Sprout size={34} />}
            title="Crop Recommendation"
            description="Find suitable crops based on soil nutrients, temperature, humidity, pH, rainfall, and other agricultural conditions."
            path="/crop"
          />

          {/* Fertilizer */}

          <FeatureCard
            icon={<FlaskConical size={34} />}
            title="Fertilizer Recommendation"
            description="Get fertilizer recommendations along with eco-friendly biodegradable alternatives."
            path="/fertilizer"
            color="yellow"
          />

          {/* Disease */}

          <FeatureCard
            icon={<SearchCheck size={34} />}
            title="Disease Detection"
            description="Upload a plant leaf image and identify disease using a trained deep learning image-classification model."
            path="/disease"
            color="purple"
          />
        </div>
      </section>

      {/* =====================================================
          ABOUT SECTION
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-8 shadow-soft lg:grid-cols-2 lg:p-12">
          {/* LEFT */}

          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-agriGreen">
              About AgriSmart
            </p>

            <h2 className="mb-5 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              Machine learning support for better farming decisions
            </h2>

            <p className="text-base leading-8 text-slate-600">
              AgriSmart combines machine learning and deep learning models with
              a clean web interface to support agriculture-related predictions
              and recommendations. The platform includes crop recommendation,
              fertilizer recommendation with biodegradable alternatives, plant
              disease detection using uploaded leaf images, and rule-based
              agricultural guidance.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/crop"
                className="inline-flex items-center justify-center rounded-xl bg-agriGreen px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-200 transition hover:bg-green-700"
              >
                Start Prediction
              </Link>

              <Link
                to="/disease"
                className="inline-flex items-center justify-center rounded-xl border border-agriGreen px-6 py-3 text-sm font-bold text-slate-800 transition hover:bg-green-50"
              >
                Detect Disease
              </Link>
            </div>
          </div>

          {/* =================================================
              RIGHT MODEL CARDS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Crop model */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-agriGreen">
                <Sprout size={26} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">Crop Model</h3>

              <p className="text-sm leading-6 text-slate-600">
                Uses a trained Random Forest model to recommend suitable crops
                from nitrogen, phosphorus, potassium, temperature, humidity, pH,
                and rainfall values.
              </p>
            </div>

            {/* Fertilizer model */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                <FlaskConical size={26} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                Fertilizer Model
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Uses soil type, crop type, moisture, temperature, humidity, and
                nutrient values to recommend a suitable fertilizer.
              </p>
            </div>

            {/* Disease */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-agriPurple">
                <SearchCheck size={26} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                Disease Detection
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Uses a trained deep learning image model to identify plant
                diseases from uploaded leaf images and provide treatment and
                prevention guidance.
              </p>
            </div>

            {/* Eco alternative */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-agriGreen">
                <Recycle size={26} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                Eco Alternatives
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Provides biodegradable fertilizer alternatives alongside
                fertilizer recommendations to support more sustainable farming
                decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="scroll-mt-28 mx-auto max-w-7xl px-5 pb-16 lg:px-8"
      >
        <div className="rounded-[2rem] bg-white p-8 shadow-soft lg:p-10">
          {/* Heading */}

          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-extrabold uppercase tracking-widest text-agriGreen">
              How It Works
            </p>

            <h2 className="text-3xl font-black text-slate-950">
              Simple prediction workflow
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* STEP 1 */}

            <div className="rounded-3xl border border-slate-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-agriGreen">
                <Leaf size={25} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                1. Enter Details
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Add crop, soil, nutrient, environmental, sensor, or leaf-image
                input depending on the selected module.
              </p>
            </div>

            {/* STEP 2 */}

            <div className="rounded-3xl border border-slate-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                <ShieldCheck size={25} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                2. Model Predicts
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                The frontend sends the input to the FastAPI ML service, where
                the trained machine learning or deep learning model processes
                the data and generates the result.
              </p>
            </div>

            {/* STEP 3 */}

            <div className="rounded-3xl border border-slate-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-agriPurple">
                <SearchCheck size={25} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">3. View Result</h3>

              <p className="text-sm leading-6 text-slate-600">
                View crop recommendations, fertilizer and biodegradable
                alternatives, rotation guidance, or plant disease results with
                treatment and prevention information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
