"use client";

import Link from "next/link";
import { Menu, X, PhoneCall } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = ["about", "services", "items", "contact"];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;
    if (path === "/") return `/${district}`;
    return `/${district}${path}`;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/items" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="container-custom flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href={makeLink("/")} className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Raj Biosis Private Limited Logo"
            className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">
              Raj<span className="text-emerald-600">biosis</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Private Limited
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={makeLink(link.path)}
              className="relative font-semibold text-slate-700 transition duration-300 hover:text-emerald-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-emerald-600 after:transition-all hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Call & Quote Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+919983123469"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
          >
            <PhoneCall size={15} className="text-emerald-600" />
            <span>+91 9983123469</span>
          </a>

          <Link href={makeLink("/contact")}>
            <button className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg shadow-emerald-600/20">
              Get Quote
            </button>
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-emerald-100 p-2 transition hover:bg-emerald-50 lg:hidden text-emerald-600"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-emerald-100 bg-white px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={makeLink(link.path)}
                onClick={() => setMenuOpen(false)}
                className="font-semibold text-slate-700 transition hover:text-emerald-600"
              >
                {link.name}
              </Link>
            ))}

            <a
              href="tel:+919983123469"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-3 font-bold text-emerald-800"
            >
              <PhoneCall size={18} className="text-emerald-600" />
              <span>Call: +91 9983123469</span>
            </a>

            <Link href={makeLink("/contact")} onClick={() => setMenuOpen(false)}>
              <button className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700">
                Get Instant Quote
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}