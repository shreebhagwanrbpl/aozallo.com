"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageBanner from "@/components/PageBanner";
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
} from "lucide-react";

const defaultServicesList = [
  {
    id: 1,
    title: "Biomedical Installation & Commissioning",
    subtitle: "Turnkey Engineer Setup & Calibration",
    desc: "Complete physical mounting, high-precision electrical safety testing, network integration, and diagnostic sensor calibration for ICU monitors, ventilators, ultrasound units, and pathology analyzers.",
    badge: "NABL Calibrated",
    highlights: ["Pre-commissioning Safety Audit", "Electrical Isolation & Surge Validation", "Clinical Operational Orientation"],
    icon: Microscope,
    color: "from-emerald-500 to-teal-700",
  },
  {
    id: 2,
    title: "Annual & Comprehensive Maintenance (AMC & CMC)",
    subtitle: "24/7 Priority Emergency Breakdown Response",
    desc: "Scheduled preventive maintenance, zero-downtime hardware inspection, 100% genuine OEM spare replacements, and round-the-clock emergency biomedical engineer dispatch.",
    badge: "Zero Downtime SLA",
    highlights: ["Quarterly Preventive Audits", "Genuine OEM Spare Replacements", "4-Hour Emergency Dispatch SLA"],
    icon: ShieldCheck,
    color: "from-green-600 to-emerald-800",
  },
  {
    id: 3,
    title: "Laboratory Diagnostic Equipment Calibration",
    subtitle: "ISO 9001:2015 & NABL Audit Compliance",
    desc: "Precision optical, electronic, and fluidic calibration of clinical biochemistry analyzers, centrifuges, spectrophotometers, and pathology equipment with certified documentation.",
    badge: "Audit-Ready Reports",
    highlights: ["NABL Traceable Calibration Certificates", "Precision Sensor & Lamp Realignment", "Quality Control Verification"],
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
    title: "Technician & Clinical Staff Operational Training",
    subtitle: "User Expertise & Safety Compliance",
    desc: "Comprehensive hands-on training for doctors, laboratory technicians, and nursing staff to ensure flawless test execution, error prevention, and safe device operation.",
    badge: "Certified Modules",
    highlights: ["Clinical Workflow Optimization", "Rapid On-Site Troubleshooting", "Device Safety Protocol Training"],
    icon: Stethoscope,
    color: "from-cyan-600 to-teal-800",
  },
  {
    id: 6,
    title: "Hardware Refurbishment & Sensor Recalibration",
    subtitle: "Device Life Extension & Component Repair",
    desc: "Component-level electronic repair, firmware upgrades, optical sensor realignment, and factory-standard reconditioning for laboratory and ICU machinery.",
    badge: "Cost Optimization",
    highlights: ["Board-Level Electronics Repair", "Optical & Fluidic Sensor Upgrades", "Extended Warranty Coverage"],
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

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  // Form State for Service Request Modal
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceName: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "aozallocom", "pages", "services")
        );
        if (snap.exists() && snap.data().services?.length > 0) {
          setServices(snap.data().services);
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
      await addDoc(
        collection(db, "websitesQueries", "aozallocom", "serviceBookings"),
        {
          ...form,
          serviceTitle: selectedService?.title || form.serviceName || "General Service Request",
          createdAt: new Date(),
        }
      );
      toast.success("Your service request has been submitted successfully!");
      setForm({ name: "", email: "", phone: "", serviceName: "", message: "" });
      setSelectedService(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request. Please call +91 9983123469");
    } finally {
      setSubmitting(false);
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Biomedical & Medical Equipment Engineering & AMC Maintenance",
    provider: {
      "@type": "Organization",
      name: "Raj Biosis",
      url: "https://aozallo.com",
    },
    areaServed: "IN",
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
        title="Biomedical Engineering Services & Technical AMC"
        subtitle="Delivering ISO 9001:2015 certified calibration, turnkey equipment installation, quarterly preventive maintenance, and 24/7 emergency hotline support for hospitals & laboratories nationwide."
      />

      {/* Quality Standards & SLA Banner */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Award size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">ISO 9001:2015 Certified</h4>
                <p className="text-xs text-slate-500 mt-1">NABL-traceable calibration documentation for lab audit compliance.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock3 size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Guaranteed Response SLA</h4>
                <p className="text-xs text-slate-500 mt-1">Priority breakdown dispatch for hospital ICUs across India.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Zero-Downtime Contracts</h4>
                <p className="text-xs text-slate-500 mt-1">Scheduled quarterly preventive audits and sensor realignment.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
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

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="tel:+919983123469"
              className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-7 py-4 rounded-2xl text-sm shadow-xl transition hover:scale-105"
            >
              <PhoneCall size={20} />
              <span>Call Helpline: +91 9983123469</span>
            </a>
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
                className="absolute top-5 right-5 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Book Technical Service</h3>
                  <p className="text-xs text-slate-500">{selectedService.title}</p>
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Service Details / Device Info</label>
                  <textarea
                    rows={3}
                    placeholder="Mention equipment brand, model, or calibration requirements..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                >
                  {submitting ? "Submitting Booking..." : "Submit Service Request"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}