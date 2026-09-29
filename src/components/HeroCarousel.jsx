"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Activity, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
const slides = [
  {
    id: 1,
    title: "ICU & Critical Care Equipment",
    subtitle: "Advanced Multi-Para Monitors & Ventilators",
    description: "Hospital-grade diagnostic monitors and emergency life support devices calibrated for precision.",
    tag: "Hospital Grade",
    badge: "100% Calibrated",
    image: "/images/biomedical-hero-1.png",
    fallbackImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: 2,
    title: "Diagnostic Laboratory Systems",
    subtitle: "Automated Analyzers & High-Res Microscopes",
    description: "High-throughput biochemistry analyzers and optical instruments for certified pathology labs.",
    tag: "High Precision",
    badge: "ISO Certified",
    image: "/images/biomedical-hero-2.png",
    fallbackImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    color: "from-green-600 to-emerald-700",
  },
  {
    id: 3,
    title: "Ultrasound & Diagnostic Imaging",
    subtitle: "3D/4D Color Doppler Imaging Systems",
    description: "Portable ultrasound machines with high frequency probes for radiology and clinical diagnostics.",
    tag: "Advanced Imaging",
    badge: "Warranty Included",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    color: "from-teal-600 to-emerald-800",
  },
  {
    id: 4,
    title: "Biomedical Maintenance & AMC",
    subtitle: "On-Site Calibration, Preventive Maintenance & Repair",
    description: "Expert biomedical engineers available 24/7 across India for preventive maintenance & repair.",
    tag: "Pan-India AMC",
    badge: "24/7 Service",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    color: "from-emerald-700 to-green-700",
  },
];

export default function HeroCarousel({ makeLink }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [heroData, setHeroData] = useState({});

  useEffect(() => {
    fetch("/api/site-data?pageType=home", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => { if (json?.data) setHeroData(json.data); })
      .catch((error) => console.error("Hero data load failed:", error));
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div
      className="relative group rounded-3xl overflow-hidden shadow-2xl border border-emerald-200/80 bg-white"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Slide Image Container */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[540px] w-full overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={heroData.title || ""}
              onError={(e) => {
                e.currentTarget.src = slide.fallbackImage;
              }}
              className="h-full w-full object-cover object-center transform transition duration-700 hover:scale-105"
            />
            {/* Gradient Overlays for readable text & sleek feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Top Badges */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-lg border border-emerald-400/40">
            <Sparkles size={14} className="animate-spin-slow text-emerald-200" />
            {heroData.badge || ""}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-lg border border-white/50">
            <ShieldCheck size={14} className="text-emerald-600" />
            {heroData.badge || ""}
          </span>
        </div>

        {/* Bottom Slide Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-2 max-w-xl"
            >
              <p className="text-emerald-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                <Activity size={14} className="text-emerald-400" />
                {heroData.subtitle || ""}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                {heroData.title || ""}
              </h3>
              <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed opacity-90">
                {heroData.description || ""}
              </p>
              
              <div className="pt-2 flex items-center gap-3">
                {makeLink && heroData.button1Text && (
                  <Link href={makeLink("/items")}>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 transition shadow-lg hover:shadow-emerald-500/30">
                      {heroData.button1Text}
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                )}
                {makeLink && heroData.button2Text && (
                  <Link href={makeLink("/contact")}>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-2.5 transition border border-white/30">
                      {heroData.button2Text}
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition opacity-80 hover:opacity-100 border border-white/20 shadow-lg hover:scale-110"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition opacity-80 hover:opacity-100 border border-white/20 shadow-lg hover:scale-110"
        >
          <ChevronRight size={22} />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 transition-all rounded-full ${
                currentSlide === idx
                  ? "w-8 bg-emerald-400 shadow-md"
                  : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Trust Card Overlay at bottom edge */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Award size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">5000+ Hospitals & Labs Served</h4>
            <p className="text-xs text-slate-400">Authorized Dealer & Service Center Across India</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-emerald-400">Live Support Available</span>
        </div>
      </div>
    </div>
  );
}
