"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import HeroCarousel from "@/components/HeroCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { generateFAQSchema } from "@/lib/seo";
import { getProductImage } from "@/lib/image-utils";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Wrench,
  Activity,
  Star,
  Sparkles,
  Award,
  Truck,
  Globe,
  ChevronDown,
  FileText,
  BadgeCheck,
  Zap,
} from "lucide-react";

const stats = [
  {
    number: "5,000+",
    title: "Healthcare Partners",
    subtitle: "Equipped Hospitals & Laboratories",
    icon: Building2,
  },
  {
    number: "3,500+",
    title: "Precision Instruments",
    subtitle: "Analyzers, ICU Systems & Reagents",
    icon: Microscope,
  },
  {
    number: "15+",
    title: "Years of Trust",
    subtitle: "Pan-India Engineering Excellence",
    icon: ShieldCheck,
  },
  {
    number: "24/7",
    title: "Rapid AMC Support",
    subtitle: "On-Site Calibration & Breakdown Repair",
    icon: Truck,
  },
];

const categoryShowcase = [
  {
    id: "icu",
    title: "ICU & Critical Care Systems",
    desc: "Hospital-grade multi-para patient monitors, mechanical ventilators, cardiac defibrillators, and syringe infusion pumps.",
    badge: "ICU Grade",
    icon: Activity,
    color: "from-emerald-500 to-teal-700",
    link: "/category/icu-critical-care",
  },
  {
    id: "pathology",
    title: "Pathology & Biochemistry",
    desc: "Fully automated clinical chemistry analyzers, high-speed 3-part & 5-part CBC hematology machines, and ELISA readers.",
    badge: "High Precision",
    icon: FlaskConical,
    color: "from-green-600 to-emerald-800",
    link: "/category/pathology-analyzer",
  },
  {
    id: "imaging",
    title: "Diagnostic Imaging & Ultrasound",
    desc: "High-resolution Color Doppler ultrasound scanners, multi-frequency transducers, and digital X-ray diagnostic solutions.",
    badge: "Advanced Imaging",
    icon: Microscope,
    color: "from-teal-600 to-cyan-700",
    link: "/category/ultrasound-imaging",
  },
  {
    id: "reagents",
    title: "Clinical Reagents & Diagnostics",
    desc: "NABL-traceable biochemistry solutions, hematology diluents, electrolyte packs, and rapid diagnostic testing kits.",
    badge: "ISO Standard",
    icon: Stethoscope,
    color: "from-emerald-600 to-green-700",
    link: "/category/reagents",
  },
];

const homeFaqs = [
  {
    question: "What types of biomedical and diagnostic equipment does Raj Biosis supply?",
    answer:
      "Raj Biosis is a single-source provider for high-precision biomedical devices and diagnostic machinery, including 3-Part/5-Part Hematology Analyzers, Automatic Biochemistry Platforms, ICU Multi-Parameter Patient Monitors, Color Doppler Ultrasound Scanners, Electrolyte Analyzers, ELISA Readers, and Pathology Reagents.",
  },
  {
    question: "Do all equipment purchases include installation, calibration, and training?",
    answer:
      "Yes. Every purchase comes with comprehensive pan-India on-site installation, NABL-traceable sensor calibration by certified biomedical engineers, and hands-on operational training for doctors, laboratory technicians, and nursing staff.",
  },
  {
    question: "What after-sales AMC and emergency breakdown repair options do you offer?",
    answer:
      "We provide custom Annual Maintenance Contracts (AMC) and Comprehensive Maintenance Contracts (CMC). Key benefits include scheduled quarterly preventive audits, genuine OEM spare replacements, and a 24/7 emergency dispatch hotline across India.",
  },
  {
    question: "Can international healthcare institutions and exporters request B2B quotations?",
    answer:
      "Absolutely. Raj Biosis works directly with international hospital groups, healthcare tenders, B2B procurement partners, and medical equipment distributors worldwide, offering export-compliant packaging, customs assistance, and international shipping.",
  },
  {
    question: "How fast can I receive an itemized quotation for equipment or AMC?",
    answer:
      "Once you submit a quote request online or speak with our sales desk (+91 9983123469), our product specialists prepare and issue an itemized official quotation with GST details within 2 to 4 business hours.",
  },
];

const defaultHomeProducts = [
  {
    title: "HD Consortium Automatic Abbott Blood Analyzer",
    slug: "hdc-lyte-plus-blood-analyzer",
    brand: "HD Consortium",
    category: "Pathology Analyzer",
    usage: "Hospitals & Diagnostic Centers",
    description: "Fully automatic blood gas and electrolyte analyzer engineered for fast, zero-error critical care analysis.",
    image: "/images/biomedical-hero-1.png",
  },
  {
    title: "Abbott i-STAT 1 Portable Clinical Point-of-Care Analyzer",
    slug: "abbott-i-stat-1-portable-analyzer",
    brand: "Abbott",
    category: "Point of Care",
    usage: "ICU & Emergency Units",
    description: "Ultra-portable handheld blood analyzer delivering laboratory-accurate diagnostic results in under 2 minutes.",
    image: "/images/biomedical-hero-2.png",
  },
  {
    title: "12.1-Inch Multi-Para Patient ICU Monitor System",
    slug: "multi-para-icu-monitor-12-inch",
    brand: "Raj Biosis",
    category: "ICU & Critical Care",
    usage: "Operating Theatres & ICUs",
    description: "High-resolution color TFT display featuring ECG, SpO2, NIBP, Respiration, and Dual Temperature monitoring.",
    image: "/images/biomedical-hero-1.png",
  },
  {
    title: "Automated Clinical Biochemistry Analyzer Platform",
    slug: "clinical-biochemistry-analyzer",
    brand: "Raj Biosis",
    category: "Biochemistry",
    usage: "Pathology & Clinical Laboratories",
    description: "High-throughput clinical chemistry platform engineered for accurate liver, kidney, and lipid profile testing.",
    image: "/images/biomedical-hero-2.png",
  },
  {
    title: "Color Doppler Digital Ultrasound Diagnostic System",
    slug: "color-doppler-ultrasound-system",
    brand: "Raj Biosis",
    category: "Ultrasound & Imaging",
    usage: "Radiology & OB/GYN Clinics",
    description: "High-frequency digital imaging console equipped with multi-frequency probes and 3D/4D diagnostic rendering.",
    image: "/images/biomedical-hero-1.png",
  },
  {
    title: "Automated Electrolyte Analyzer (Na+ / K+ / Cl- / Ca++)",
    slug: "electrolyte-analyzer-standard",
    brand: "Raj Biosis",
    category: "Electrolyte Reader",
    usage: "Diagnostic Laboratories",
    description: "Advanced ion-selective electrode (ISE) technology featuring long-life, maintenance-free sensor modules.",
    image: "/images/biomedical-hero-2.png",
  },
];

const defaultHomeServices = [
  {
    title: "Biomedical Equipment Installation & Commissioning",
    desc: "Turnkey physical installation, electrical safety validation, and optical/sensor calibration by certified engineers pan-India.",
    icon: Microscope,
  },
  {
    title: "Annual & Comprehensive Maintenance Contracts (AMC / CMC)",
    desc: "24/7 emergency hotline support, guaranteed response SLAs, and scheduled quarterly preventive maintenance visits.",
    icon: ShieldCheck,
  },
  {
    title: "ISO 9001:2015 NABL Calibration & Certification",
    desc: "NABL-traceable calibration, optical alignment, and official compliance documentation for laboratory audit readiness.",
    icon: FlaskConical,
  },
];

export default function Home({ city: initialCity }) {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    requirement: "",
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });

  const pathParts = pathname.split("/").filter(Boolean);
  const staticRoutes = ["about", "services", "items", "contact"];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";
  const city = initialCity
    ? initialCity
    : district
    ? district
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const makeLink = (path) => {
    if (!district) return path;
    if (path === "/") return `/${district}`;
    return `/${district}${path}`;
  };

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "aozallocom", "pages", "home")
        );
        if (snap.exists()) {
          setHeroData(snap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Services
        const serviceSnap = await getDoc(
          doc(db, "websites", "aozallocom", "pages", "services")
        );
        if (serviceSnap.exists()) {
          setServices(serviceSnap.data().services || []);
        }

        // Products
        let loadedProducts = [];
        const productSnap = await getDoc(
          doc(db, "websites", "aozallocom", "pages", "products")
        );
        if (productSnap.exists() && Array.isArray(productSnap.data().products)) {
          loadedProducts = productSnap.data().products;
        }

        // If no products doc or empty, fallback to full catalog
        if (loadedProducts.length === 0) {
          const catalog = await fetchFullCatalog();
          if (catalog && catalog.length > 0) {
            loadedProducts = catalog;
          }
        }

        if (loadedProducts.length > 0) {
          const data = loadedProducts.map((item) => ({
            ...item,
            slug:
              item.slug ||
              item.title
                ?.toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-"),
          }));
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      return toast.error("Please fill in your Name and Phone Number");
    }

    try {
      setSubmitting(true);
      await addDoc(
        collection(db, "websitesQueries", "aozallocom", "homeB2BQueries"),
        {
          ...form,
          city: city || "General",
          createdAt: new Date(),
        }
      );
      toast.success("Thank you! Your quotation request has been submitted.");
      setForm({ name: "", email: "", phone: "", requirement: "", company: "" });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting quote request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const icons = [
    <Microscope size={30} key={1} />,
    <FlaskConical size={30} key={2} />,
    <ShieldCheck size={30} key={3} />,
    <Stethoscope size={30} key={4} />,
    <Wrench size={30} key={5} />,
    <Activity size={30} key={6} />,
  ];

  const defaultTitle = "Advanced Biomedical & Diagnostic Medical Equipment";
  const defaultDesc =
    "Empowering hospitals, diagnostic centers, and pathology laboratories across India with cutting-edge medical devices, ICU monitors, surgical instruments, and 24/7 AMC technical maintenance support.";
  const defaultBtn1 = "Explore Products";
  const defaultBtn2 = "Get Custom Quote";

  const displayTitle =
    heroData?.title && heroData.title.trim() !== ""
      ? heroData.title
      : defaultTitle;
  const displayDesc =
    heroData?.description && heroData.description.trim() !== ""
      ? heroData.description
      : defaultDesc;
  const displayBtn1 =
    heroData?.button1Text && heroData.button1Text.trim() !== ""
      ? heroData.button1Text
      : defaultBtn1;
  const displayBtn2 =
    heroData?.button2Text && heroData.button2Text.trim() !== ""
      ? heroData.button2Text
      : defaultBtn2;

  const displayProducts = products.length > 0 ? products : defaultHomeProducts;
  const displayServices = services.length > 0 ? services : defaultHomeServices;

  const faqSchemaData = generateFAQSchema(homeFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchemaData),
        }}
      />

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-green-100/60 py-16 sm:py-20 lg:py-24">
        {/* Ambient Glow Elements */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-300/20 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-300/20 blur-[140px] pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6 sm:space-y-7"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 border border-emerald-300/60 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>India's Trusted Biomedical Partner</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-12 w-3/4 rounded-xl bg-emerald-100"></div>
                    <div className="h-12 w-2/3 rounded-xl bg-emerald-100"></div>
                  </div>
                ) : (
                  <>
                    <span>{displayTitle}</span>

                    {city && (
                      <span className="block mt-2 text-2xl lg:text-4xl font-extrabold text-emerald-600 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">
                        in {city}
                      </span>
                    )}
                  </>
                )}
              </h1>

              {/* Subtitle / Description */}
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 rounded bg-emerald-100"></div>
                  <div className="h-4 w-11/12 rounded bg-emerald-100"></div>
                  <div className="h-4 w-8/12 rounded bg-emerald-100"></div>
                </div>
              ) : (
                <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
                  {displayDesc}
                  {city && (
                    <>
                      {" "}across <strong>{city}</strong>
                    </>
                  )}
                </p>
              )}

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>ISO 9001:2015 Certified Equipment</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Pan-India On-Site Installation</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>24/7 AMC Maintenance & Repair</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Genuine Spares & Full Warranty</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                {loading ? (
                  <>
                    <div className="h-14 w-48 animate-pulse rounded-2xl bg-emerald-100"></div>
                    <div className="h-14 w-40 animate-pulse rounded-2xl bg-emerald-100"></div>
                  </>
                ) : (
                  <>
                    <Link href={makeLink("/items")}>
                      <button className="group relative inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-emerald-600/25 transition-all duration-300 hover:bg-emerald-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-600/40">
                        <span>{displayBtn1}</span>
                        <ArrowRight
                          size={18}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    </Link>

                    <Link href={makeLink("/contact")}>
                      <button className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-emerald-600/30 bg-white/90 backdrop-blur-md px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-600 hover:-translate-y-1 shadow-sm">
                        <PhoneCall size={18} />
                        <span>{displayBtn2}</span>
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Rating & Trust Social Proof */}
              <div className="pt-3 flex items-center gap-4 border-t border-slate-200/80">
                <div className="flex -space-x-2">
                  <div className="h-9 w-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow">
                    4.9
                  </div>
                  <div className="h-9 w-9 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow">
                    ★
                  </div>
                  <div className="h-9 w-9 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow">
                    5K+
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <span className="text-xs font-extrabold text-slate-800 ml-1">
                      4.9 / 5.0 Rating
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Trusted by 5,000+ Hospitals, Labs & Clinics
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Carousel Slider */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:col-span-6 w-full"
            >
              <HeroCarousel makeLink={makeLink} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS BAR
      ============================================================ */}
      <section className="bg-white py-16 border-y border-emerald-100">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:scale-110 transition">
                      <Icon size={26} />
                    </div>
                    <span className="text-3xl font-black text-emerald-600">
                      {item.number}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {item.subtitle}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRODUCT CATEGORY SHOWCASE
      ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <SectionTitle
            badge="Product Categories"
            title="Comprehensive Medical & Diagnostic Solutions"
            description="Explore our specialized product categories engineered for pathology laboratories, hospital ICUs, imaging centers, and diagnostic facilities."
            center
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categoryShowcase.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative rounded-3xl bg-white p-8 border border-emerald-100 shadow-lg shadow-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition`}
                    >
                      <Icon size={26} />
                    </div>
                    <span className="mt-6 inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      {cat.badge}
                    </span>
                    <h3 className="mt-3 text-xl font-black text-slate-900 group-hover:text-emerald-600 transition">
                      {cat.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <Link
                      href={makeLink(cat.link)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      Explore Products
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED PRODUCTS CATALOG GRID
      ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            badge="Featured Equipment"
            title="High-Demand Biomedical Instruments"
            description="Browse our top-selling diagnostic analyzers, patient monitors, and laboratory devices trusted by healthcare institutions."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayProducts.slice(0, 6).map((product) => (
              <motion.div
                key={product.slug || product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-lg shadow-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 bg-gradient-to-br from-emerald-50/50 to-slate-50 flex items-center justify-center p-6 border-b border-slate-100">
                    <img
                      src={getProductImage(product, "/images/biomedical-hero-1.png")}
                      alt={product.title || "Biomedical Product"}
                      className="max-h-48 w-auto object-contain transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/medical-analyzer-default.png";
                      }}
                    />
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                      {product.category || "Biomedical"}
                    </span>
                  </div>

                  <div className="p-7">
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description ||
                        product.desc ||
                        "Advanced medical equipment designed for precision diagnostic performance."}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          Brand
                        </span>
                        <span className="font-semibold text-slate-800">
                          {product.brand || "Raj Biosis"}
                        </span>
                      </div>
                      <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          Application
                        </span>
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {product.usage || "Clinical / Hospital"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-7 pb-7 pt-2 flex items-center justify-between border-t border-slate-100">
                  <Link
                    href={makeLink(`/items/${product.slug}`)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold py-3 transition shadow-md"
                  >
                    View Product Details
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href={makeLink("/items")}>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-extrabold text-white hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/20">
                <span>View Full Equipment Catalog</span>
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES OVERVIEW
      ============================================================ */}
      <section className="section-padding bg-gradient-to-b from-white to-emerald-50/60 border-t border-slate-100">
        <div className="container-custom">
          <SectionTitle
            badge="Our Services"
            title="Professional Biomedical Services & Technical AMC"
            description="Comprehensive engineering, calibration, installation, and maintenance services for healthcare facilities."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayServices.slice(0, 3).map((service, index) => (
              <ServiceCard
                key={index}
                icon={icons[index]}
                title={service.title}
                description={service.desc || service.description}
              />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href={makeLink("/services")}>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-extrabold text-white hover:bg-emerald-700 transition shadow-lg">
                View All Technical Services
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          INTERNATIONAL B2B & EXPORT SECTION
      ============================================================ */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-4 py-1.5 text-xs font-bold text-emerald-400">
                <Globe size={14} />
                <span>International B2B & Medical Export Supply</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Global Supplier & Exporter of Diagnostic & ICU Machinery
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Raj Biosis caters to international B2B buyers, hospital procurement teams, government healthcare tenders, and regional medical distributors with export-compliant medical equipment, certified calibration, and door-to-door shipping.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <BadgeCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">CE & ISO Standards</h4>
                    <p className="text-xs text-slate-400 mt-1">Certified quality assurance for export orders.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <Truck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Export Freight Logistics</h4>
                    <p className="text-xs text-slate-400 mt-1">Air & ocean cargo packaging with insurance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Request B2B Export Quote</h3>
              <p className="text-xs text-slate-400 mb-6">
                Submit bulk enquiry for hospital projects, distribution rights, or export pricing.
              </p>

              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-4 py-3 border border-slate-700 outline-none focus:border-emerald-500"
                />
                <input
                  type="email"
                  placeholder="Business Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-4 py-3 border border-slate-700 outline-none focus:border-emerald-500"
                />
                <input
                  type="tel"
                  placeholder="Mobile / WhatsApp Number *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-4 py-3 border border-slate-700 outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Hospital / Company Name"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-4 py-3 border border-slate-700 outline-none focus:border-emerald-500"
                />
                <textarea
                  rows={3}
                  placeholder="Specify Product Requirement & Quantity"
                  value={form.requirement}
                  onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-4 py-3 border border-slate-700 outline-none focus:border-emerald-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3.5 rounded-xl transition"
                >
                  {submitting ? "Submitting Request..." : "Request Fast Itemized Quotation"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ SECTION WITH SCHEMA ACCORDION
      ============================================================ */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <SectionTitle
            badge="Frequently Asked Questions"
            title="Everything You Need to Know About Ordering & Service"
            description="Find quick answers to common questions regarding biomedical equipment purchase, installation support, AMC service contracts, and export logistics."
            center
          />

          <div className="mt-14 max-w-4xl mx-auto space-y-4">
            {homeFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/60 transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-600 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-emerald-600" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}