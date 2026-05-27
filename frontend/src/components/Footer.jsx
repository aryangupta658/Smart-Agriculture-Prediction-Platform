import { Link } from "react-router-dom";
import { Leaf, Mail, Sprout, Code2 } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-agriGreen">
                <Leaf size={28} fill="currentColor" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold">
                  Agri<span className="text-agriGreen">Smart</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Smart Agriculture Platform
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-600">
              AgriSmart is an AI-powered agriculture platform for crop
              recommendation, fertilizer recommendation, biodegradable
              alternatives, and plant disease detection.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-black text-slate-900">Quick Links</h3>

            <div className="flex flex-col gap-3 text-sm font-semibold text-slate-600">
              <Link to="/" className="hover:text-agriGreen">
                Home
              </Link>

              <Link to="/crop" className="hover:text-agriGreen">
                Crop Recommendation
              </Link>

              <Link to="/fertilizer" className="hover:text-agriGreen">
                Fertilizer Recommendation
              </Link>

              <Link to="/disease" className="hover:text-agriGreen">
                Disease Detection
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-black text-slate-900">Project</h3>

            <div className="flex flex-col gap-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Sprout size={17} className="text-agriGreen" />
                ML + FastAPI + React
              </p>

              <p className="flex items-center gap-2">
                <Code2 size={17} className="text-agriGreen" />
                Smart Agriculture Project
              </p>

              <p className="flex items-center gap-2">
                <Mail size={17} className="text-agriGreen" />
                Contact / Support
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AgriSmart. Built for smart agriculture
          prediction.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
