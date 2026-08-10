"use client";

import { useRef, useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ProductBrochure({ product, selectedImage: propSelectedImage, isOpen, onClose }) {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [base64Image, setBase64Image] = useState("");

  const rawImage =
    propSelectedImage ||
    product?.images?.[0] ||
    product?.image ||
    product?.img ||
    product?.imageUrl ||
    "/images/medical-analyzer-default.png";

  useEffect(() => {
    if (!isOpen || !rawImage) return;

    let isMounted = true;

    // Convert rawImage URL to pure Base64 via Blob fetch (bypasses canvas tainting)
    const loadAsBase64 = async (url) => {
      if (!url) return "";
      if (url.startsWith("data:")) return url;

      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve("");
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn("Base64 fetch fallback for PDF:", err);
        return "";
      }
    };

    loadAsBase64(rawImage).then((b64) => {
      if (isMounted && b64) {
        setBase64Image(b64);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, rawImage]);

  if (!isOpen || !product) return null;

  const title = product.title || "Biomedical Equipment";
  const brand = product.brand || "HD Consortium / Raj Biosis";
  const model = product.model || product.slug || "Standard Model";
  const instrument = product.instrument || product.category || "Biomedical Diagnostic Analyzer";
  const usage = product.usage || "Clinical Laboratory / Hospital";
  const automation = product.automation || "Fully Automatic";
  const capacity = product.capacity || product.throughput || "High Throughput";
  const description =
    product.desc ||
    product.description ||
    `The ${title} is an advanced biomedical diagnostic system engineered for high precision, accuracy, and operational reliability in medical laboratories, hospitals, and clinical diagnostics settings across India.`;

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const element = printRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          const clonedSheet = clonedDoc.getElementById("brochure-card-sheet");
          if (clonedSheet) {
            clonedSheet.style.margin = "0";
            clonedSheet.style.boxShadow = "none";
            clonedSheet.style.borderRadius = "0";
          }
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      const sanitizedName = (title || "Product")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/_+/g, "_");

      pdf.save(`${sanitizedName}_Specification_Brochure.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Error generating PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const finalImgSrc = base64Image || rawImage;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.85)" }}
    >
      {/* Top Action Bar */}
      <div className="fixed top-4 right-4 sm:right-8 z-50 flex items-center gap-3">
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-xl font-extrabold px-5 py-3 text-xs sm:text-sm shadow-2xl transition hover:scale-105 active:scale-95 disabled:opacity-75 cursor-pointer"
          style={{ backgroundColor: "#D97706", color: "#0F172A" }}
        >
          <Download size={18} />
          <span>{downloading ? "Generating PDF..." : "Download Brochure PDF"}</span>
        </button>

        <button
          onClick={onClose}
          className="h-11 w-11 rounded-xl text-white flex items-center justify-center transition shadow-xl cursor-pointer"
          style={{ backgroundColor: "#1E293B" }}
          aria-label="Close Brochure"
        >
          <X size={20} />
        </button>
      </div>

      {/* Brochure Sheet Container with EXPLICIT Standard Inline Styles */}
      <div
        id="brochure-card-sheet"
        ref={printRef}
        className="relative w-full max-w-[850px] shadow-2xl rounded-xl overflow-hidden my-12"
        style={{
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          minHeight: "1100px",
          border: "1px solid #E2E8F0",
        }}
      >
        {/* Background Watermark */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center select-none rotate-[-35deg] text-5xl font-black tracking-widest uppercase"
          style={{ color: "#0F172A", opacity: 0.04 }}
        >
          Rajbiosis Private Limited
        </div>

        {/* 1. Header Bar */}
        <div
          className="px-8 py-5 flex items-center justify-between"
          style={{
            backgroundColor: "#0F172A",
            color: "#FFFFFF",
            borderBottom: "4px solid #D97706",
          }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Rajbiosis Private Limited
            </h1>
            <p className="text-[11px] font-medium" style={{ color: "#CBD5E1" }}>
              Diagnostic Instruments & Healthcare Solutions
            </p>
          </div>
          <div className="text-right text-xs space-y-1" style={{ color: "#E2E8F0" }}>
            <p><strong style={{ color: "#F59E0B" }}>Phone:</strong> +91 9983123469</p>
            <p><strong style={{ color: "#F59E0B" }}>Web:</strong> www.aozallo.com</p>
          </div>
        </div>

        {/* 2. Document Title & Banner */}
        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black leading-snug" style={{ color: "#0F172A" }}>
              {title}, Model Name/Number: {model}
            </h2>
          </div>

          {/* Gold Banner */}
          <div
            className="font-extrabold text-xs sm:text-sm tracking-wider uppercase text-center py-2.5 rounded-md shadow-sm"
            style={{ backgroundColor: "#D97706", color: "#FFFFFF" }}
          >
            OFFICIAL PRODUCT SPECIFICATION BROCHURE
          </div>

          {/* 3. Top Grid: Product Image & Key Specs */}
          <div className="grid sm:grid-cols-12 gap-6 pt-2 items-stretch">
            {/* Image Container */}
            <div
              className="sm:col-span-5 rounded-xl p-4 flex flex-col items-center justify-center min-h-[260px]"
              style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
            >
              <span className="text-[10px] font-bold uppercase mb-2 text-center" style={{ color: "#94A3B8" }}>
                {title}
              </span>
              <img
                src={finalImgSrc}
                alt={title}
                className="max-h-48 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/medical-analyzer-default.png";
                }}
              />
            </div>

            {/* Specifications Table */}
            <div
              className="sm:col-span-7 rounded-xl overflow-hidden flex flex-col"
              style={{ border: "1px solid #E2E8F0" }}
            >
              <div
                className="px-4 py-2.5 text-xs font-black uppercase tracking-wider"
                style={{ backgroundColor: "#0F172A", color: "#FFFFFF" }}
              >
                KEY SPECIFICATIONS
              </div>
              <table className="w-full text-xs text-left border-collapse flex-1">
                <tbody>
                  <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#F8FAFC" }}>
                    <td className="p-2.5 font-bold w-1/3" style={{ color: "#334155" }}>Brand:</td>
                    <td className="p-2.5 font-semibold" style={{ color: "#0F172A" }}>{brand}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="p-2.5 font-bold" style={{ color: "#334155" }}>Model:</td>
                    <td className="p-2.5 font-semibold" style={{ color: "#0F172A" }}>{model}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#F8FAFC" }}>
                    <td className="p-2.5 font-bold" style={{ color: "#334155" }}>Instrument:</td>
                    <td className="p-2.5 font-semibold" style={{ color: "#0F172A" }}>{instrument}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="p-2.5 font-bold" style={{ color: "#334155" }}>Usage:</td>
                    <td className="p-2.5 font-semibold" style={{ color: "#0F172A" }}>{usage}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#F8FAFC" }}>
                    <td className="p-2.5 font-bold" style={{ color: "#334155" }}>Automation:</td>
                    <td className="p-2.5 font-semibold" style={{ color: "#0F172A" }}>{automation}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold" style={{ color: "#334155" }}>Size / Capacity:</td>
                    <td className="p-2.5 font-semibold" style={{ color: "#0F172A" }}>{capacity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Product Overview */}
          <div className="pt-2">
            <h3
              className="text-xs font-black uppercase tracking-wider pb-1 w-fit mb-2"
              style={{ color: "#0F172A", borderBottom: "2px solid #0F172A" }}
            >
              PRODUCT OVERVIEW
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#334155" }}>
              {description}
            </p>
          </div>

          {/* 5. Key Applications & Why Choose Us */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            {/* Key Applications */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
              <div className="px-4 py-2 text-xs font-black uppercase tracking-wider" style={{ backgroundColor: "#0F172A", color: "#FFFFFF" }}>
                KEY APPLICATIONS
              </div>
              <ul className="p-4 space-y-2 text-xs font-medium" style={{ color: "#334155" }}>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#D97706" }} />
                  Clinical Diagnostic Laboratories
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#D97706" }} />
                  Hospitals & Healthcare Centres
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#D97706" }} />
                  Pathology & Testing Labs
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#D97706" }} />
                  Blood Banks & Research Units
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#D97706" }} />
                  Medical Colleges & Institutions
                </li>
              </ul>
            </div>

            {/* Why Choose Rajbiosis */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
              <div className="px-4 py-2 text-xs font-black uppercase tracking-wider" style={{ backgroundColor: "#0F172A", color: "#FFFFFF" }}>
                WHY CHOOSE RAJBIOSIS PRIVATE LIMITED
              </div>
              <ul className="p-4 space-y-2 text-xs font-medium" style={{ color: "#334155" }}>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#10B981" }} />
                  Trusted Biomedical Equipment Supplier
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#10B981" }} />
                  100% Genuine Leading Brand Products
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#10B981" }} />
                  Competitive Pricing & Warranty Support
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#10B981" }} />
                  Prompt Installation & Staff Training
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#10B981" }} />
                  Fast Express Delivery Across India
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. Document Footer */}
        <div
          className="mt-8 px-8 py-4 flex flex-wrap items-center justify-between text-[10px] gap-2"
          style={{
            backgroundColor: "#0F172A",
            color: "#FFFFFF",
            borderTop: "2px solid #D97706",
          }}
        >
          <div>
            <strong style={{ color: "#FFFFFF" }}>RAJBIOSIS PRIVATE LIMITED - Diagnostic Instruments & Healthcare Solutions</strong>
            <p className="mt-0.5" style={{ color: "#CBD5E1" }}>Biomedical equipment sales, service, installation, AMC & calibration across India</p>
          </div>
          <div className="text-right font-semibold" style={{ color: "#94A3B8" }}>
            Official Product Brochure | Confidential & Proprietary
          </div>
        </div>
      </div>
    </div>
  );
}
