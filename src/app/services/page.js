"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import { useContactInfo } from "@/lib/useContactInfo";
import { phoneHref, whatsappHref } from "@/lib/contact-utils";
import SectionTitle from "@/components/SectionTitle";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Clock3,
  Award,
  Zap,
  X,
  FileCheck,
  Building2,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const defaultServicesList = [
  {
    id: 1,
    title: "Clinical Analyzer Calibration & Comprehensive AMC Services",
    subtitle: "Turnkey Engineer Setup & NABL Calibration",
    desc: "Certified calibration services with documented traceability reports, quarterly preventive maintenance audits, genuine OEM spare replacements, and complete AMC solutions tailored for high-throughput diagnostic facilities.",
    badge: "NABL Calibrated",
    highlights: ["Pre-commissioning Safety Audit", "NABL Traceable Calibration Certificates", "Quarterly Preventive Maintenance"],
    icon: Microscope,
    color: "from-emerald-500 to-teal-700",
  },
  {
    id: 2,
    title: "Annual & Comprehensive Maintenance Contracts (AMC / CMC)",
    subtitle: "24/7 Priority Emergency Breakdown Response",
    desc: "Scheduled preventive maintenance, zero-downtime hardware inspection, 100% genuine OEM spare replacements, and round-the-clock emergency biomedical engineer dispatch across India.",
    badge: "Zero Downtime SLA",
    highlights: ["Quarterly Preventive Audits", "Genuine OEM Spare Replacements", "4-Hour Emergency Dispatch SLA"],
    icon: ShieldCheck,
    color: "from-green-600 to-emerald-800",
  },
  {
    id: 3,
    title: "Laboratory Modernization, Expansion & Automation Planning",
    subtitle: "High-Throughput Clinical Architecture",
    desc: "Upgrading legacy diagnostic departments with automated high-throughput chemistry, hematology, and immunology systems optimized for maximum specimen turnaround speed and error-free operation.",
    badge: "Workflow Optimization",
    highlights: ["Department Layout Design", "Automated Specimen Routing", "LIS / HIS Software Integration"],
    icon: FlaskConical,
    color: "from-teal-600 to-cyan-700",
  },
  {
    id: 4,
    title: "Hospital ICU & Critical Care Systems Maintenance",
    subtitle: "Life-Support Hardware Reliability",
    desc: "Comprehensive multi-parameter patient monitor calibration, ventilator flow validation, defibrillator shock output testing, and emergency life support unit maintenance.",
    badge: "ICU Mission Critical",
    highlights: ["Multi-Para Sensor Calibration", "Ventilator Flow & Pressure Validation", "Defibrillator Energy Verification"],
    icon: Activity,
    color: "from-emerald-600 to-green-700",
  },
  {
    id: 5,
    title: "Analyzer Implementation & Technical Application Support",
    subtitle: "Specialist Assistance & Operator Training",
    desc: "On-demand application specialist assistance, protocol optimization, new assay configuration, and operator refresher workshops for clinical laboratory teams and hospital staff.",
    badge: "Application Specialist",
    highlights: ["Clinical Protocol Optimization", "Operator Hands-on Training", "Rapid Troubleshooting Support"],
    icon: Stethoscope,
    color: "from-cyan-600 to-teal-800",
  },
  {
    id: 6,
    title: "Cold-Chain Reagent Logistics & Standardized Multi-Level Controls",
    subtitle: "Temperature-Controlled Quality Assurance",
    desc: "Temperature-monitored distribution of multi-analyte controls, calibrators, and diagnostic kits ensuring maximum stability, shelf-life, and precise diagnostic reproducibility.",
    badge: "Cold-Chain Verified",
    highlights: ["2°C to 8°C Monitored Logistics", "Standardized Multi-Level Controls", "Batch Consistency Guarantee"],
    icon: Wrench,
    color: "from-green-500 to-emerald-700",
  },
];

const serviceSteps = [
  {
    step: "01",
    title: "Consultation & Facility Inspection",
    desc: "Evaluating hospital or pathology laboratory requirements, device performance history, and technical calibration parameters.",
  },
  {
    step: "02",
    title: "Itemized Scope & AMC Quotation",
    desc: "Providing a detailed scope breakdown covering AMC service levels, calibration certificates, and genuine spare parts.",
  },
  {
    step: "03",
    title: "On-Site Execution & NABL Calibration",
    desc: "Deployment of certified biomedical engineers to perform precise physical installation, sensor calibration, or emergency repair.",
  },
  {
    step: "04",
    title: "Compliance Certification & 24/7 AMC Support",
    desc: "Issuing formal NABL-traceable audit certificates alongside continuous 24/7 emergency hotline assistance.",
  },
];

const defaultIcons = [Microscope, ShieldCheck, FlaskConical, Activity, Stethoscope, Wrench];
const defaultColors = [
  "from-emerald-500 to-teal-700",
  "from-green-600 to-emerald-800",
  "from-teal-600 to-cyan-700",
  "from-emerald-600 to-green-700",
  "from-cyan-600 to-teal-800",
  "from-green-500 to-emerald-700",
];
const defaultBadges = [
  "NABL Calibrated",
  "Zero Downtime SLA",
  "Workflow Optimization",
  "ICU Mission Critical",
  "Application Specialist",
  "Cold-Chain Verified",
];

export default function ServicesPage({ city: initialCity }) {
  const pathname = usePathname();
  const { primaryPhone, primaryPhoneHref, primaryWhatsAppHref } = useContactInfo();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  const pathParts = pathname ? pathname.split("/").filter(Boolean) : [];
  const staticRoutes = ["about", "services", "items", "contact", "products"];
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

  // Form State for Service Request Modal
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    facilityName: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/site-data?pageType=services", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        const json = await response.json().catch(() => ({}));
        if (json?.data?.services && Array.isArray(json.data.services) && json.data.services.length > 0) {
          setServices(json.data.services);
        } else {
          setServices(defaultServicesList);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices(defaultServicesList);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      return toast.error("Please enter your Name and Phone Number");
    }

    try {
      setSubmitting(true);
      const serviceTitle = selectedService?.title || "Biomedical Service";
      await fetch("/api/contact-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.facilityName,
          requirement: `Service Booking Request: ${serviceTitle}. Details: ${form.message || "No extra notes"}${city ? ` | Location: ${city}` : ""}`,
          subject: `Service Request: ${serviceTitle}`,
        }),
      }).then(async (res) => {
        const result = await res.json().catch(() => ({}));
        if (!res.ok || result.success === false) {
          throw new Error(result.error || "Submission failed");
        }
        return result;
      });

      toast.success("Your service request has been submitted successfully! Our engineering team will contact you shortly.");
      setForm({ name: "", email: "", phone: "", facilityName: "", message: "" });
      setSelectedService(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit service request. Please try again or call our hotline.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayServices = services.length > 0 ? services : defaultServicesList;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Biomedical & Medical Equipment Engineering & AMC Maintenance",
    provider: {
      "@type": "Organization",
      name: "Raj Biosis",
      url: "https://aozallo.com",
    },
    areaServed: city || "India",
    description:
      "Professional biomedical calibration, equipment installation, technical assistance, and Annual Maintenance Contracts (AMC) across India.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      {/* Hero Banner */}
      <PageBanner
        title={city ? `Biomedical Engineering & AMC Services in ${city}` : "Biomedical Engineering Services & Technical AMC"}
        subtitle={
          city
            ? `Certified calibration, hospital equipment installation, quarterly preventive maintenance, and 24/7 emergency ICU hotline support across ${city}.`
            : "Delivering ISO 9001:2015 certified calibration, turnkey equipment installation, quarterly preventive maintenance, and 24/7 emergency hotline support for hospitals & laboratories nationwide."
        }
      />

      {/* Quality Standards & SLA Banner */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <Award size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">ISO 9001:2015 Certified</h4>
                <p className="text-xs text-slate-500 mt-1">NABL-traceable calibration documentation for lab audit compliance.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <Clock3 size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Guaranteed Response SLA</h4>
                <p className="text-xs text-slate-500 mt-1">Priority breakdown dispatch for hospital ICUs across India.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Zero-Downtime Contracts</h4>
                <p className="text-xs text-slate-500 mt-1">Scheduled quarterly preventive audits and sensor realignment.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Genuine OEM Spares</h4>
                <p className="text-xs text-slate-500 mt-1">Direct OEM components with full operational replacement warranty.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MAIN SERVICES CATALOG GRID
      ============================================================ */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container-custom">
          <SectionTitle
            badge="Engineering Solutions"
            title={city ? `Our Biomedical & Technical Services in ${city}` : "Specialized Biomedical & Engineering Services"}
            description="From turnkey analyzer installation to NABL-traceable calibration and 24/7 AMC coverage, our certified biomedical engineers support healthcare institutions at every step."
            center
          />

          {loading ? (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                  <div className="h-6 w-3/4 rounded-lg bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-5/6 rounded bg-slate-200" />
                  <div className="h-10 w-full rounded-xl bg-slate-200 mt-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {displayServices.map((service, index) => {
                const Icon = defaultIcons[index % defaultIcons.length];
                const color = defaultColors[index % defaultColors.length];
                const badge = service.badge || defaultBadges[index % defaultBadges.length];
                const highlights = service.highlights || [
                  "Certified Biomedical Engineers",
                  "NABL Traceable Documentation",
                  "Genuine Spare Parts Assurance",
                ];

                return (
                  <motion.div
                    key={service.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="group relative rounded-3xl bg-white p-8 border border-emerald-100/80 shadow-lg shadow-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header with Icon & Badge */}
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition shrink-0`}
                        >
                          <Icon size={26} />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                          {badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-6 text-xl font-black text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                        {service.title}
                      </h3>

                      {/* Subtitle if available */}
                      {service.subtitle && (
                        <p className="text-xs font-bold text-emerald-600 mt-1">
                          {service.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {service.desc || service.description}
                      </p>

                      {/* Highlights */}
                      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                        {highlights.map((item, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedService(service)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                      >
                        <span>Book Service / Quote</span>
                        <ArrowRight size={14} />
                      </button>

                      {primaryPhoneHref && (
                        <a
                          href={primaryPhoneHref}
                          title={`Call for ${service.title}`}
                          className="h-10 w-10 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition shrink-0"
                        >
                          <PhoneCall size={16} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4-Step Working Process */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50/60">
        <div className="container-custom">
          <SectionTitle
            badge="Execution Process"
            title="Streamlined 4-Step Service Delivery Workflow"
            description="Our structured engineering protocol guarantees precise calibration, NABL compliance, and rapid repair turnaround times."
            center
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-4">
            {serviceSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group relative rounded-3xl border border-emerald-100 bg-white p-7 shadow-lg shadow-slate-100 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl"
              >
                <span className="text-5xl font-black text-emerald-100 group-hover:text-emerald-300 transition">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>
                <div className="mt-6 h-1 w-12 rounded-full bg-emerald-500 transition-all duration-300 group-hover:w-20" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Service Call Banner */}
      <section className="py-16 bg-slate-950 text-white">
        <div className="container-custom flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
              Emergency Technical Support
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Need Immediate Medical Equipment Repair or AMC?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Our biomedical engineers are on standby 24/7 for urgent hospital ICU repairs, calibration, and AMC inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {primaryPhone && (
              <a
                href={primaryPhoneHref || "#"}
                className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-7 py-4 rounded-2xl text-sm shadow-xl transition hover:scale-105"
              >
                <PhoneCall size={20} />
                <span>Call Helpline: {primaryPhone}</span>
              </a>
            )}

            {primaryWhatsAppHref && (
              <a
                href={`${primaryWhatsAppHref}?text=Hello,%20I%20need%20biomedical%20equipment%20service/AMC%20support.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white font-bold px-6 py-4 rounded-2xl text-sm transition hover:bg-slate-800"
              >
                <MessageSquare size={18} className="text-green-400" />
                <span>WhatsApp Support</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Service Request Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Book Technical Service</h3>
                  <p className="text-xs text-emerald-700 font-semibold line-clamp-1">{selectedService.title}</p>
                </div>
              </div>

              <form onSubmit={handleServiceSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
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
                    placeholder="10-digit phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hospital / Laboratory Name</label>
                  <input
                    type="text"
                    placeholder="Hospital, Clinic or Diagnostic Center"
                    value={form.facilityName}
                    onChange={(e) => setForm({ ...form, facilityName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Service Details / Equipment Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Mention equipment brand, model number, or specific calibration requirements..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white resize-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  {submitting ? "Submitting Booking Request..." : "Submit Service Request"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}