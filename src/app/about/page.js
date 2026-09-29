import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import DynamicPhoneLink from "@/components/DynamicPhoneLink";
import SectionTitle from "@/components/SectionTitle";
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  PhoneCall,
  ArrowRight,
  Globe,
  Stethoscope,
  Microscope,
  CheckCircle2,
  Wrench,
  Clock,
  Sparkles,
} from "lucide-react";
export const metadata = {
  title: "About Us | Leading Biomedical Equipment & Diagnostic Solutions Partner | Raj Biosis",
  description:
    "Discover Raj Biosis - India's premier supplier, authorized dealer & exporter of high-precision biomedical devices, ICU monitors, pathology analyzers, and hospital maintenance AMC services.",
  alternates: {
    canonical: "https://aozallo.com/about",
  },
  openGraph: {
    title: "About Raj Biosis | Biomedical Engineering & Diagnostic Machinery",
    description: "Empowering healthcare facilities, diagnostic centers, and hospital ICUs across India with cutting-edge medical technologies.",
    url: "https://aozallo.com/about",
  },
};

export default function AboutPage() {
  const stats = [
    { number: "15+", label: "Years of Industry Leadership", icon: Award },
    { number: "5,000+", label: "Hospitals & Laboratories Served", icon: Building2 },
    { number: "100%", label: "Genuine OEM Certified Hardware", icon: ShieldCheck },
    { number: "24/7", label: "Emergency AMC Technical Helpline", icon: Clock },
  ];

  const pillars = [
    {
      icon: Microscope,
      title: "Precision Diagnostics",
      desc: "Supplying NABL-traceable, high-throughput pathology analyzers and clinical chemistry platforms engineered for zero-error diagnostic accuracy.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Stethoscope,
      title: "Critical Care Engineering",
      desc: "Equipping hospital ICUs and emergency rooms with advanced multi-parameter patient monitors, mechanical ventilators, and resuscitation systems.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Wrench,
      title: "Pan-India AMC & CMC Support",
      desc: "Dedicated team of certified biomedical engineers delivering turnkey installation, sensor calibration, preventive maintenance, and 24/7 repair.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Globe,
      title: "Global B2B Medical Export",
      desc: "Authorized exporter providing export-grade packaging, international customs compliance, and direct B2B supply for overseas healthcare buyers.",
      color: "from-purple-500 to-indigo-700",
    },
  ];

  const milestones = [
    {
      year: "2010",
      title: "Foundation & Local Distribution",
      desc: "Established in Jaipur, Rajasthan as a specialized distributor of clinical laboratory equipment and pathology diagnostic machinery.",
    },
    {
      year: "2015",
      title: "Pan-India Network Expansion",
      desc: "Expanded direct sales channels and technical engineering centers across key healthcare centers throughout northern and central India.",
    },
    {
      year: "2020",
      title: "Critical Care & ICU Division",
      desc: "Launched dedicated ICU equipment supply, multi-para monitor integration, and 24/7 emergency maintenance contracts for hospital ICUs.",
    },
    {
      year: "2024+",
      title: "ISO 9001:2015 & Global Export Operations",
      desc: "Achieved international ISO quality management certification and scaled export supply channels for global B2B healthcare partners.",
    },
  ];

  return (
    <>
      {/* Banner */}
      <PageBanner
        title="About Rajbiosis Private Limited"
        subtitle="Empowering hospitals, diagnostic laboratories, clinical testing facilities, and ICU centers across India with world-class biomedical machinery & engineering support."
      />

      {/* Main Company Intro Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image & Floating Cards */}
            <div className="lg:col-span-6 relative">
              <div className="relative overflow-hidden rounded-[36px] border border-emerald-100 bg-slate-900 shadow-2xl shadow-emerald-950/10">
                <img
                  src="/images/about-company-hero.png"
                  alt="Raj Biosis Biomedical Engineering Facility & Diagnostic Laboratory"
                  className="w-full h-[450px] sm:h-[550px] object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Overlaid Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-200 shadow-lg text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ISO 9001:2015 Certified Supplier</span>
                </div>
              </div>

              {/* Floating Stat Card 1 */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-3xl p-5 border border-emerald-100 shadow-2xl space-y-1 max-w-[220px]">
                <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-2xl">
                  <Award size={26} />
                  <span>15+ Years</span>
                </div>
                <p className="text-xs font-semibold text-slate-600">Pioneering Medical Equipment Excellence</p>
              </div>

              {/* Floating Stat Card 2 */}
              <div className="absolute top-1/2 -left-6 hidden sm:flex bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-2xl items-center gap-4 max-w-[240px]">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="text-lg font-black text-white">5,000+</div>
                  <div className="text-[11px] text-slate-400 font-medium">Hospitals & Labs Equipped</div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6">
              <SectionTitle
                badge="Who We Are"
                title="Pioneering Healthcare Machinery & Biomedical Engineering in India"
                description="Raj Biosis is a leading supplier, authorized dealer, and maintenance partner for high-precision diagnostic analyzers, hospital ICU units, and laboratory machinery."
              />

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Founded with an unyielding commitment to healthcare quality, <strong>Rajbiosis Private Limited</strong> delivers state-of-the-art diagnostic instruments engineered for speed, high clinical precision, and long operational life. We serve top-tier private hospital networks, government healthcare institutions, clinical testing laboratories, and pathology centers nationwide.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Beyond equipment supply, our certified biomedical engineering team delivers complete turnkey installation, NABL-traceable sensor calibration, structured Annual Maintenance Contracts (AMC/CMC), and a 24/7 technical hotline for zero diagnostic downtime.
              </p>

              {/* Feature Points */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>100% Genuine OEM Hardware & Spares</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>Pan-India On-Site Installation</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>24/7 Emergency AMC Support</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>Global Medical Export Compliant</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link href="/items">
                  <button className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/25">
                    <span>Explore Full Catalog</span>
                    <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-emerald-600/30 bg-white px-7 py-3.5 text-sm font-extrabold text-emerald-700 hover:bg-emerald-50 transition shadow-sm">
                    <PhoneCall size={18} />
                    <span>Speak with Product Experts</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="py-12 bg-slate-900 text-white border-y border-slate-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="h-12 w-12 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white">{stat.number}</div>
                  <div className="text-xs text-slate-400 font-semibold">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Corporate Pillars */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <SectionTitle
            badge="Our Pillars"
            title="End-to-End Solutions for Healthcare Facilities"
            description="Built to meet the uncompromising standards of hospital ICUs, pathology laboratories, and diagnostic centers."
            center
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-lg mb-6`}
                    >
                      <Icon size={26} />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">{pillar.title}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones & History Timeline */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <SectionTitle
            badge="Our Growth Journey"
            title="A History of Trust & Healthcare Innovation"
            description="Defining milestones that have established Raj Biosis as India's trusted biomedical equipment provider."
            center
          />

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition shadow-md"
              >
                <div className="inline-block text-2xl font-black text-emerald-600 bg-emerald-100/80 px-4 py-1.5 rounded-2xl mb-4 border border-emerald-200">
                  {m.year}
                </div>
                <h4 className="text-lg font-bold text-slate-900">{m.title}</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container-custom text-center space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <Sparkles size={14} />
            <span>Ready to Upgrade Your Medical Facility?</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">
            Get an Fast Itemized Quotation for Medical Equipment Today
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Connect directly with our biomedical specialists for immediate pricing and technical availability.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <button className="rounded-2xl bg-slate-900 px-8 py-4 text-sm font-extrabold text-white hover:bg-slate-950 transition shadow-2xl">
                Request Fast Quotation
              </button>
            </Link>
            <DynamicPhoneLink>
              <button className="rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-emerald-800 hover:bg-emerald-50 transition shadow-xl">
                Call
              </button>
            </DynamicPhoneLink>
          </div>
        </div>
      </section>
    </>
  );
}