import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function FeatureCard({ icon, title, description, path, color = "green" }) {
  const iconStyle =
    color === "purple"
      ? "bg-purple-100 text-agriPurple"
      : color === "yellow"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-agriGreen";

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${iconStyle}`}
      >
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mb-6 text-sm leading-6 text-slate-600">{description}</p>

      <Link
        to={path}
        className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-bold text-agriGreen transition hover:bg-agriGreen hover:text-white"
      >
        Get Started <ArrowRight size={17} />
      </Link>
    </div>
  );
}

export default FeatureCard;
