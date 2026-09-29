"use client";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import {
  FaPlay,
  FaShareAlt,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLink,
} from "react-icons/fa";
import { useContactInfo } from "@/lib/useContactInfo";
import ProductBrochure from "@/components/ProductBrochure";
import {
  Download,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileCheck,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { getProductImage } from "@/lib/image-utils";
export default function ProductDetails({ slug, product: initialProduct }) {
    const { primaryPhone, primaryPhoneHref, primaryWhatsAppHref } = useContactInfo();

  const [product, setProduct] = useState(initialProduct || null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(() => {
    if (initialProduct) {
      return getProductImage(initialProduct, "/images/medical-analyzer-default.png");
    }
    return "";
  });
  const [selectedMedia, setSelectedMedia] = useState("image");
  const [showShare, setShowShare] = useState(false);
  const [showBrochure, setShowBrochure] = useState(false);
  const [loading, setLoading] = useState(!initialProduct);
  const [openFaq, setOpenFaq] = useState(0);

  const shareRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const staticRoutes = ["about", "services", "items", "contact"];
  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";
  const cityName = district
    ? district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "India";

  useEffect(() => {
    if (initialProduct) return;
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
        const json = await res.json().catch(() => ({}));
        const fullCatalog = (json.success && Array.isArray(json.products)) ? json.products : [];
        const found = fullCatalog.find(
          (p) =>
            p.slug === slug ||
            p.title
              ?.toLowerCase()
              .trim()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-") === slug
        );

        if (found) {
          setProduct(found);
          const firstImg = getProductImage(found, "/images/medical-analyzer-default.png");
          setSelectedImage(firstImg);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, initialProduct]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-24">
        <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
          <div className="h-10 w-2/3 bg-slate-200 rounded-xl" />
          <div className="h-96 w-full bg-slate-200 rounded-3xl" />
          <div className="h-32 w-full bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Product Not Found</h2>
        <p className="mt-4 text-slate-600">The requested equipment could not be found in our catalog.</p>
        <Link href="/items" className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white">
          Back to Equipment Catalog
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          url: shareUrl,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      setShowShare(!showShare);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied!");
    setShowShare(false);
  };

  const handleWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied for Instagram!");
    setShowShare(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      return toast.error("Please provide your Name and Phone Number");
    }

    try {
      setSubmitting(true);
      await fetch("/api/product-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productName: product?.title || "",
          productSlug: product?.slug || "",
          brand: product?.brand || "",
          model: product?.model || "",
        }),
      }).then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) throw new Error(result.error || "Submission failed");
        return result;
      });
      toast.success("Quotation request submitted! Our sales team will call you shortly.");
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const productFaqs = [
    {
      q: `What is ${product.title} used for in ${cityName}?`,
      a: `${product.title} is widely deployed in clinical laboratories, hospital ICUs, operating rooms, and diagnostic testing facilities for precise patient care and diagnostics.`,
    },
    {
      q: `What is the price of ${product.title} in ${cityName}?`,
      a: `Pricing depends on specifications, warranty package, and optional accessories. Submit a fast quote request or submit the enquiry form for an itemized quotation.`,
    },
    {
      q: `Are you an authorized supplier of ${product.title}?`,
      a: `Yes, Rajbiosis Private Limited is a trusted supplier and authorized technical maintenance partner providing genuine brand equipment across India.`,
    },
    {
      q: `Do you provide installation and staff operational training in ${cityName}?`,
      a: `Yes! Every equipment purchase includes complete on-site installation by certified biomedical engineers and comprehensive hands-on staff training.`,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link href="/items" className="hover:text-emerald-600">Products</Link>
          <span>/</span>
          <span className="text-emerald-700 truncate max-w-xs">{product.title}</span>
        </div>

        {/* TOP HERO SECTION: Gallery + Quick Summary */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative h-[340px] sm:h-[420px] bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center overflow-hidden">
                {selectedMedia === "image" ? (
                  <img
                    src={selectedImage || product.images?.[0] || product.image || "/images/medical-analyzer-default.png"}
                    alt={product.title}
                    className="max-h-full w-auto object-contain transition duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/images/medical-analyzer-default.png";
                    }}
                  />
                ) : (
                  <iframe
                    src={product.videoUrl}
                    title={product.title}
                    className="w-full h-full rounded-xl"
                    allowFullScreen
                  />
                )}
                <span className="absolute top-4 left-4 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-300">
                  {product.category || "Biomedical Equipment"}
                </span>
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(img);
                        setSelectedMedia("image");
                      }}
                      className={`h-20 w-20 rounded-xl border-2 p-1 bg-slate-50 overflow-hidden shrink-0 transition ${
                        selectedImage === img
                          ? "border-emerald-600 ring-2 ring-emerald-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Key Product Info & Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {product.brand || "Raj Biosis"}
                  </span>
                  <h1 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                    {product.title}
                  </h1>
                </div>

                <div ref={shareRef} className="relative">
                  <button
                    onClick={handleNativeShare}
                    className="w-11 h-11 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 text-slate-700 transition"
                  >
                    <FaShareAlt size={16} />
                  </button>

                  {showShare && (
                    <div className="absolute right-0 top-14 w-52 bg-white rounded-2xl shadow-2xl border p-2 z-50">
                      <button onClick={handleCopy} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded flex items-center gap-2">
                        <FaLink /> Copy Link
                      </button>
                      <button onClick={handleWhatsapp} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded flex items-center gap-2 text-green-600">
                        <FaWhatsapp /> WhatsApp
                      </button>
                      <button onClick={handleFacebook} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded flex items-center gap-2 text-blue-600">
                        <FaFacebook /> Facebook
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Specification Grid Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Model</span>
                  <span className="font-bold text-slate-900">{product.model || "Standard"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Automation</span>
                  <span className="font-bold text-slate-900">{product.automation || "Fully Automatic"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Availability</span>
                  <span className="font-bold text-emerald-700">In Stock • Express Delivery</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-3">
                <button
                  onClick={() => setShowBrochure(true)}
                  className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-6 py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
                >
                  <Download size={20} />
                  <span>Download Official Product Brochure (PDF)</span>
                </button>

                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={primaryPhoneHref || "#"}
                    className="inline-flex items-center justify-center gap-2 border-2 border-emerald-600 bg-emerald-50 text-emerald-800 font-bold px-5 py-3 rounded-xl hover:bg-emerald-100 transition text-xs sm:text-sm"
                  >
                    <PhoneCall size={16} className="text-emerald-600" />
                    <span>{primaryPhone}</span>
                  </a>
                  <a
                    href={`${primaryWhatsAppHref || ""}?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border-2 border-green-600 bg-green-50 text-green-800 font-bold px-5 py-3 rounded-xl hover:bg-green-100 transition text-xs sm:text-sm"
                  >
                    <FaWhatsapp size={18} className="text-green-600" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600" /> ISO 9001:2015</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600" /> Free Installation</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600" /> 24/7 Technical AMC</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: 2-Column Grid (Left: Quote Form | Right: Description & Specs) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quote Form & Direct Hotline */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Fast Price Quotation
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Request Itemized Quote
                </h3>
                <p className="text-xs text-slate-500">
                  Receive price details, tax invoice breakdown, and delivery timeframe within 2 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="lab@hospital.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                >
                  {submitting ? "Submitting Request..." : "Submit Quotation Request"}
                </button>
              </form>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Rajbiosis Buyer Protection</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>100% Genuine OEM Certified Equipment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Pan-India Certified Engineer Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>GST Tax Invoice & Export Logistics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Description & Specifications */}
          <div className="lg:col-span-7 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
              <h3 className="text-2xl font-extrabold text-slate-900">Product Description</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                {product.desc ||
                  product.description ||
                  `The ${product.title} is a high-performance biomedical diagnostic analyzer engineered for clinical diagnostic accuracy, continuous operating reliability, and seamless workflow integration in modern laboratories and hospital care settings.`}
              </p>

              {/* Full Specs Table */}
              <div className="pt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                  Technical Specifications Table
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <tbody>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-700 w-1/3">Brand</td>
                        <td className="p-3 font-semibold text-slate-900">{product.brand || "Raj Biosis"}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-3 font-bold text-slate-700">Model Name / Number</td>
                        <td className="p-3 font-semibold text-slate-900">{product.model || product.slug || "Standard"}</td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-700">Clinical Instrument</td>
                        <td className="p-3 font-semibold text-slate-900">{product.instrument || product.category || "Diagnostic Analyzer"}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-3 font-bold text-slate-700">Intended Usage</td>
                        <td className="p-3 font-semibold text-slate-900">{product.usage || "Clinical Laboratories & Hospitals"}</td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-700">Automation Level</td>
                        <td className="p-3 font-semibold text-slate-900">{product.automation || "Fully Automatic"}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-700">Size / Capacity</td>
                        <td className="p-3 font-semibold text-slate-900">{product.capacity || product.throughput || "Standard"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Full Width Applications & SEO Summary Grid */}
        <div className="mt-12 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-8">
          <div className="max-w-3xl">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Applications & Supply Network
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Why Healthcare Institutions Choose {product.title} in {cityName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Raj Biosis is a leading supplier, dealer, and authorized maintenance partner of {product.title} in {cityName}. We deliver calibrated equipment, genuine spare parts, and on-site technical assistance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Building2 size={24} className="text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900">Hospital & ICU Units</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Deployed in critical care wards, emergency rooms, and surgical centers.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <FileCheck size={24} className="text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900">Pathology Laboratories</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Ensuring rapid sample turnaround and high diagnostic test accuracy.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <ShieldCheck size={24} className="text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900">Certified Warranty & AMC</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Comprehensive maintenance contracts with 24/7 emergency engineer dispatch.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Clock size={24} className="text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900">Fast Express Shipping</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Secure wooden crating and Pan-India logistics delivery.</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Frequently Asked Questions */}
        <div className="mt-12 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 mt-1">Common questions about {product.title} pricing, warranty, and installation in {cityName}.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {productFaqs.map((faq, index) => (
              <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                  <HelpCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brochure Modal Component */}
      <ProductBrochure
        product={product}
        selectedImage={selectedImage}
        isOpen={showBrochure}
        onClose={() => setShowBrochure(false)}
      />
    </div>
  );
}