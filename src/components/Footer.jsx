"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = ["about", "services", "products", "contact", "items"];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "aozallocom", "pages", "contact")
        );
        if (snap.exists()) {
          setContactInfo(snap.data().contactInfo || []);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    loadContact();
  }, []);

  useEffect(() => {
    const loadDistrict = async () => {
      if (!district) return;
      try {
        const snap = await getDoc(
          doc(db, "websites", "aozallocom", "districts", district)
        );
        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadDistrict();
  }, [district]);

  const rawPhone = contactInfo.find((x) => x.label === "Phone Number")?.value;
  const phone = "9983123469";
  const displayPhone = "+91 9983123469";

  const email =
    contactInfo.find((x) => x.label === "Email Address")?.value ||
    "rajbiosis@yahoo.in";

  const address =
    contactInfo.find((x) => x.label === "Office Address")?.value ||
    "Rajbiosis Private Limited, Jaipur, Rajasthan, India";

  const dynamicAddress = districtData
    ? `${districtData.district}, ${districtData.state}, India`
    : address;

  const mapAddress = encodeURIComponent(dynamicAddress);

  const makeLink = (path) => {
    if (!district) return path;
    if (path === "/") return `/${district}`;
    return `/${district}${path}`;
  };

  const productCategories = [
    { name: "ICU & Critical Care Equipment", link: "/category/icu-critical-care" },
    { name: "Hematology & CBC Analyzers", link: "/category/pathology-analyzer" },
    { name: "Biochemistry Analyzers", link: "/category/biochemistry" },
    { name: "Ultrasound & Diagnostic Imaging", link: "/category/ultrasound-imaging" },
    { name: "Electrolyte Analyzers & Readers", link: "/category/electrolyte-reader" },
    { name: "Laboratory Reagents & Test Kits", link: "/category/reagents" },
  ];

  if (loading) {
    return (
      <footer className="bg-slate-900 text-white border-t border-slate-800">
        <div className="container-custom py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-8 w-40 bg-slate-800 rounded animate-pulse mb-6" />
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="h-5 bg-slate-800 rounded animate-pulse mb-4"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom py-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Column 1: Company Info */}
          <div className="lg:col-span-4 space-y-5">
            <Link href={makeLink("/")} className="inline-flex items-center gap-3.5 group">
              <div className="bg-white p-1.5 rounded-2xl shadow-lg border border-slate-700 shrink-0">
                <img
                  src="/logo.png"
                  alt="Rajbiosis Private Limited Logo"
                  className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white leading-tight">
                  <span className="text-emerald-400">Rajbiosis</span> Private Limited
                </h2>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Healthcare & Diagnostic Solutions
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier biomedical & diagnostic equipment partner. Supplying hospital-grade patient monitors, hematology analyzers, ultrasound machines, and 24/7 technical AMC maintenance across India & export markets.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3.5 py-2 rounded-xl w-fit">
              <ShieldCheck size={16} />
              <span>ISO 9001:2015 Certified Supplier</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { name: "Home", link: "/" },
                { name: "About Us", link: "/about" },
                { name: "Products Catalog", link: "/items" },
                { name: "Services & AMC", link: "/services" },
                { name: "Contact Us", link: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={makeLink(item.link)}
                    className="text-slate-400 transition hover:text-emerald-400 hover:translate-x-1 inline-flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="text-emerald-500" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Product Categories
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              {productCategories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={makeLink(cat.link)}
                    className="text-slate-400 transition hover:text-emerald-400 inline-flex items-center gap-1.5 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Contact & Location
            </h3>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="font-semibold text-white">{dynamicAddress}</p>
                  <a
                    href={`https://maps.google.com/?q=${mapAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline mt-1"
                  >
                    <span>View Location Map</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <a
                    href={`tel:+91${phone}`}
                    className="font-bold text-white hover:text-emerald-400 transition text-sm"
                  >
                    {displayPhone}
                  </a>
                  <p className="text-[10px] text-slate-400">Direct Sales & Technical Hotline</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <a
                    href={`mailto:${email}`}
                    className="font-semibold text-slate-200 hover:text-emerald-400 transition break-all"
                  >
                    {email}
                  </a>
                  <p className="text-[10px] text-slate-400">Fast Quotation Enquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Google Map Preview Strip */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-slate-800 h-44 shadow-lg relative">
          <iframe
            src={`https://maps.google.com/maps?q=${mapAddress}&z=12&output=embed`}
            width="100%"
            height="100%"
            loading="lazy"
            className="border-0 w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition duration-500"
            title="Raj Biosis Google Location Map"
          />
          <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-bold text-emerald-400 flex items-center gap-2">
            <MapPin size={14} />
            <span>Rajbiosis Private Limited • Headquarters Location</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900 pt-6 text-xs text-slate-500">
          <p>© 2026 Rajbiosis Private Limited. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Official Biomedical & Diagnostic Partner Across India</span>
          </p>
        </div>
      </div>
    </footer>
  );
}