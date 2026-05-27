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
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute left-0 top-40 h-72 w-72 rounded-full bg-green-100 blur-3xl" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-sky-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
          {/* LEFT CONTENT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2 text-sm font-bold text-agriGreen">
              <Sprout size={17} />
              AI Powered Agriculture
            </div>

            <h1 className="mb-6 text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Smart Decisions For <br />
              Better <span className="text-agriGreen">Farming</span>
              <span className="ml-2 inline-block">🌿</span>
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
              Get AI-based recommendations for crops, fertilizers, biodegradable
              alternatives, and plant disease detection with image analysis.
            </p>

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

          {/* RIGHT HERO IMAGE */}
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

      {/* ================= FEATURES SECTION ================= */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-extrabold uppercase tracking-widest text-agriGreen">
            Our Features
          </p>

          <h2 className="text-3xl font-black text-slate-950 md:text-4xl">
            Everything You Need For Smarter Agriculture
          </h2>

          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-agriGreen" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Sprout size={34} />}
            title="Crop Recommendation"
            description="Find the best crops to grow based on soil nutrients and environmental conditions."
            path="/crop"
          />

          <FeatureCard
            icon={<FlaskConical size={34} />}
            title="Fertilizer Recommendation"
            description="Get fertilizer suggestions along with eco-friendly biodegradable alternatives."
            path="/fertilizer"
            color="yellow"
          />

          <FeatureCard
            icon={<SearchCheck size={34} />}
            title="Disease Detection"
            description="Upload a leaf image and detect diseases instantly using AI-powered image analysis."
            path="/disease"
            color="purple"
          />
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-8 shadow-soft lg:grid-cols-2 lg:p-12">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-agriGreen">
              About AgriSmart
            </p>

            <h2 className="mb-5 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              AI support for better farming decisions
            </h2>

            <p className="text-base leading-8 text-slate-600">
              AgriSmart combines machine learning models with a clean web
              interface to help users make agriculture-related predictions. The
              platform supports crop recommendation, fertilizer recommendation
              with biodegradable alternatives, and plant disease detection using
              uploaded leaf images.
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-agriGreen">
                <Sprout size={26} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">Crop Model</h3>

              <p className="text-sm leading-6 text-slate-600">
                Predicts a suitable crop using nitrogen, phosphorus, potassium,
                temperature, humidity, pH, and rainfall values.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                <FlaskConical size={26} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                Fertilizer Model
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Suggests fertilizer based on crop type, soil type, moisture, and
                nutrient values.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-agriPurple">
                <SearchCheck size={26} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                Disease Detection
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Uses a deep learning model to identify plant disease from leaf
                images.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-agriGreen">
                <Recycle size={26} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                Eco Alternatives
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Provides biodegradable fertilizer alternatives to support more
                sustainable farming decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW SECTION ================= */}
      <section
        id="how-it-works"
        className="scroll-mt-28 mx-auto max-w-7xl px-5 pb-16 lg:px-8"
      >
        <div className="rounded-[2rem] bg-white p-8 shadow-soft lg:p-10">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-extrabold uppercase tracking-widest text-agriGreen">
              How It Works
            </p>

            <h2 className="text-3xl font-black text-slate-950">
              Simple prediction workflow
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-agriGreen">
                <Leaf size={25} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                1. Enter Details
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Add crop, soil, nutrient, weather, or image input based on the
                selected prediction module.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                <ShieldCheck size={25} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">
                2. Model Predicts
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                The frontend sends data to the FastAPI ML service where trained
                models generate predictions.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-agriPurple">
                <SearchCheck size={25} />
              </div>

              <h3 className="mb-2 font-black text-slate-900">3. View Result</h3>

              <p className="text-sm leading-6 text-slate-600">
                The platform displays crop, fertilizer, biodegradable
                alternative, or disease prediction result.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
