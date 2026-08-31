import { Link, NavLink } from "react-router-dom";

import { Menu, X, UserRound } from "lucide-react";

import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  // =====================================================
  // LINKS
  // =====================================================

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "Crop Recommendation",
      path: "/crop",
    },

    {
      name: "Fertilizer Recommendation",
      path: "/fertilizer",
    },

    {
      name: "Disease Detection",
      path: "/disease",
    },

    {
      name: "Sensor Readings",
      path: "/sensors",
    },
  ];

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <nav className="flex w-full items-center justify-between px-5 py-1 lg:px-12">
        {/* =================================================
            LOGO
        ================================================= */}

        <Link to="/" onClick={closeMenu} className="flex items-center gap-1">
          <img
            src="/images/logo.png"
            alt="AgriSmart logo"
            className="h-20 w-20 shrink-0 object-contain lg:h-24 lg:w-24"
          />

          <div className="-ml-2">
            <h1 className="text-xl font-extrabold leading-5 text-slate-950">
              Agri
              <span className="text-agriGreen">Smart</span>
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              Smart Agriculture Platform
            </p>
          </div>
        </Link>

        {/* =================================================
            DESKTOP LINKS
        ================================================= */}

        <div className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative whitespace-nowrap text-sm font-bold transition ${
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

        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            to="/crop"
            className="rounded-xl bg-agriGreen px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700"
          >
            Get Started
          </Link>

          <button
            type="button"
            aria-label="User profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-agriGreen hover:text-agriGreen"
          >
            <UserRound size={20} />
          </button>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm xl:hidden"
          onClick={() => setOpen((previous) => !previous)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-sm xl:hidden">
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

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-agriGreen hover:text-agriGreen"
            >
              <UserRound size={19} />
              Profile
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
