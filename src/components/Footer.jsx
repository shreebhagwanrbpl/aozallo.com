"use client";
import { useEffect, useState } from "react";
import { getContactValue, parseContactValues, phoneHref, mailHref } from "@/lib/contact-utils";
import { makeSlug } from "@/lib/catalog-utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState([
    { label: "Address", value: "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021, India" },
    { label: "Email", value: "mail@rajbiosis.com" },
    { label: "Phone Number", value: "8318368383" }
  ]);
  const [categories, setCategories] = useState([]);
  const [districtData, setDistrictData] = useState(null);

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = ["about", "services", "products", "contact", "items", "category"];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  useEffect(() => {
    let isMounted = true;

    // Load contact info from DB
    fetch("/api/site-data?pageType=contact", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => r.json())
      .then((json) => {
        if (isMounted && json?.data?.contactInfo && json.data.contactInfo.length > 0) {
          setContactInfo(json.data.contactInfo);
        }
      })
      .catch((err) => console.log("Footer contact load:", err));

    // Load dynamic categories from catalog API
    fetch("/api/catalog", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => r.json())
      .then((json) => {
        if (!isMounted || !json) return;
        if (Array.isArray(json.categories) && json.categories.length > 0) {
          const formatted = json.categories.map((c) => ({
            name: c.name || c.category,
            slug: c.slug || makeSlug(c.name || c.category),
            link: `/category/${c.slug || makeSlug(c.name || c.category)}`,
            count: c.totalProductsCount ?? (Array.isArray(c.products) ? c.products.length : 0),
          }));
          setCategories(formatted);
        } else if (Array.isArray(json.products) && json.products.length > 0) {
          const uniqueMap = new Map();
          json.products.forEach((p) => {
            const catName = (p.category || "").trim();
            if (catName && !uniqueMap.has(catName.toLowerCase())) {
              const slug = p.categoryId || makeSlug(catName);
              uniqueMap.set(catName.toLowerCase(), {
                name: catName,
                slug,
                link: `/category/${slug}`,
              });
            }
          });
          if (uniqueMap.size > 0) {
            setCategories(Array.from(uniqueMap.values()));
          }
        }
      })
      .catch((err) => console.log("Footer catalog categories load:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!district) return;
    let isMounted = true;
    fetch(`/api/site-data?pageType=district&district=${encodeURIComponent(district)}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => r.json())
      .then((json) => {
        if (isMounted && json?.data) {
          setDistrictData(json.data);
        }
      })
      .catch((err) => console.log("Footer district load:", err));

    return () => {
      isMounted = false;
    };
  }, [district]);

  const phone = getContactValue(contactInfo, ["Phone", "Phone Number", "Mobile", "Mobile Number", "Contact"]) || "8318368383";
  const phoneNumbers = parseContactValues(phone);
  const email = getContactValue(contactInfo, ["Email", "Email Address", "Mail"]) || "mail@rajbiosis.com";
  const address = getContactValue(contactInfo, ["Address", "Office Address"]) || "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021, India";
  const dynamicAddress = districtData?.address
    ? districtData.address
    : (district ? `${districtData?.district || district}, India` : address);

  const mapAddress = encodeURIComponent(dynamicAddress || address);

  const makeLink = (path) => {
    if (!district) return path;
    if (path.startsWith("/category")) return path;
    if (path === "/") return `/${district}`;
    return `/${district}${path}`;
  };

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

          {/* Column 3: Product Categories (100% Dynamic from DB) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Product Categories</span>
              {categories.length > 0 && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                  {categories.length}
                </span>
              )}
            </h3>
            {categories.length > 0 ? (
              <ul className="space-y-2.5 text-xs font-medium">
                {categories.slice(0, 8).map((cat) => (
                  <li key={cat.name || cat.slug}>
                    <Link
                      href={makeLink(cat.link)}
                      className="text-slate-400 transition hover:text-emerald-400 inline-flex items-center gap-1.5 group"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition shrink-0" />
                      <span className="line-clamp-1">{cat.name}</span>
                    </Link>
                  </li>
                ))}
                {categories.length > 8 && (
                  <li className="pt-1">
                    <Link
                      href={makeLink("/items")}
                      className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      <span>View all categories ({categories.length})</span>
                      <ArrowRight size={12} />
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <div className="space-y-2 py-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-800/50 rounded animate-pulse w-3/4" />
                ))}
              </div>
            )}
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
                  {phoneNumbers.map((number, index) => (
                    <a key={index} href={phoneHref(number) || "#"} className="block font-bold text-white hover:text-emerald-400 transition text-sm">
                      {number}
                    </a>
                  ))}
                  <p className="text-[10px] text-slate-400">Direct Sales & Technical Hotline</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <a
                    href={mailHref(parseContactValues(email)[0]) || "#"}
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