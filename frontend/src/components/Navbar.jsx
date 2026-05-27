import { Link, NavLink } from "react-router-dom";
import { Leaf, Menu, X, UserRound } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Crop Recommendation", path: "/crop" },
    { name: "Fertilizer Recommendation", path: "/fertilizer" },
    { name: "Disease Detection", path: "/disease" },
  ];

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <nav className="flex w-full items-center justify-between px-5 py-4 lg:px-12">
        {/* LOGO */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-agriGreen shadow-sm">
            <Leaf size={28} fill="currentColor" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold leading-5 text-slate-950">
              Agri<span className="text-agriGreen">Smart</span>
            </h1>
            <p className="text-xs text-slate-500">Smart Agriculture Platform</p>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative text-sm font-bold transition ${
                  isActive
                    ? "text-agriGreen"
                    : "text-slate-800 hover:text-agriGreen"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-agriGreen" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/crop"
            className="rounded-xl bg-agriGreen px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700"
          >
            Get Started
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-agriGreen hover:text-agriGreen"
            aria-label="User profile"
          >
            <UserRound size={20} />
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-sm lg:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-green-50 text-agriGreen"
                      : "text-slate-800 hover:bg-green-50 hover:text-agriGreen"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/crop"
              onClick={closeMenu}
              className="mt-2 rounded-xl bg-agriGreen px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-green-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
