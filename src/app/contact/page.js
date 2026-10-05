"use client";
import React, { useEffect, useState, useMemo, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  MessageSquare,
  Send,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Search,
  Navigation,
  Sparkles,
  ChevronRight,
  Headphones,
  Check,
  Building,
  Radio,
  Copy
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { getContactValue, parseContactValues, phoneHref, mailHref, whatsappHref } from "@/lib/contact-utils";
// Pre-defined central location dictionary for key districts & major Indian cities
const DISTRICT_DATABASE = {
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    type: "Headquarters & Central Logistics Hub",
    address: "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021, India",
    landmark: "Ajmer-Delhi Bypass Rd, Tagor Nagar",
    pincode: "302021",
    mapQuery: "Rajbiosis Private Limited, F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Headquarters Direct Line"
  },
  delhi: {
    name: "Delhi",
    state: "Delhi NCR",
    type: "NCR Central Regional Hub",
    address: "AIIMS Ring Road Medical Complex Zone, New Delhi, Delhi 110029, India",
    landmark: "AIIMS Ring Road Medical Complex Zone",
    pincode: "110029",
    mapQuery: "AIIMS New Delhi, Ansari Nagar, New Delhi, Delhi 110029",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Delhi NCR Service Desk"
  },
  kota: {
    name: "Kota",
    state: "Rajasthan",
    type: "Hadoti Regional Operations Branch",
    address: "Jhalawar Road, Near New Medical College, Kota, Rajasthan 324005, India",
    landmark: "Jhalawar Road, Near New Medical College",
    pincode: "324005",
    mapQuery: "Government Medical College, Jhalawar Road, Kota, Rajasthan 324005",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Kota Regional Lead"
  },
  jodhpur: {
    name: "Jodhpur",
    state: "Rajasthan",
    type: "Marwar Regional Service Hub",
    address: "Shastri Nagar, Near MDM Hospital, Jodhpur, Rajasthan 342003, India",
    landmark: "Shastri Nagar, Near MDM Hospital",
    pincode: "342003",
    mapQuery: "Mathura Das Mathur Hospital, Shastri Nagar, Jodhpur, Rajasthan 342003",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Jodhpur Division Manager"
  },
  udaipur: {
    name: "Udaipur",
    state: "Rajasthan",
    type: "Mewar Regional Branch",
    address: "Court Circle, Near RNT Medical College, Udaipur, Rajasthan 313001, India",
    landmark: "Court Circle, Near RNT Medical College",
    pincode: "313001",
    mapQuery: "RNT Medical College, Court Circle, Udaipur, Rajasthan 313001",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Udaipur Service Team"
  },
  bikaner: {
    name: "Bikaner",
    state: "Rajasthan",
    type: "North Rajasthan Service Hub",
    address: "Hospital Road, Near PBM Hospital, Bikaner, Rajasthan 334001, India",
    landmark: "Hospital Road, Near PBM Hospital",
    pincode: "334001",
    mapQuery: "PBM Hospital, Hospital Road, Bikaner, Rajasthan 334001",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Bikaner District Lead"
  },
  ajmer: {
    name: "Ajmer",
    state: "Rajasthan",
    type: "Central Rajasthan Support Center",
    address: "Ana Sagar Link Road, Near JLN Hospital, Ajmer, Rajasthan 305001, India",
    landmark: "Ana Sagar Link Road, Near JLN Hospital",
    pincode: "305001",
    mapQuery: "Jawaharlal Nehru Hospital, Ana Sagar Link Road, Ajmer, Rajasthan 305001",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Ajmer Regional Executive"
  },
  alwar: {
    name: "Alwar",
    state: "Rajasthan",
    type: "Alwar District Service Hub",
    address: "Near Rajiv Gandhi Govt Hospital, Alwar, Rajasthan 301001, India",
    landmark: "Near Rajiv Gandhi Govt Hospital",
    pincode: "301001",
    mapQuery: "Rajiv Gandhi General Hospital, Alwar, Rajasthan 301001",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Alwar Regional Desk"
  },
  bhilwara: {
    name: "Bhilwara",
    state: "Rajasthan",
    type: "Bhilwara Regional Branch",
    address: "Near Mahatma Gandhi Hospital, Bhilwara, Rajasthan 311001, India",
    landmark: "Near Mahatma Gandhi Hospital",
    pincode: "311001",
    mapQuery: "Mahatma Gandhi Hospital, Bhilwara, Rajasthan 311001",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Bhilwara Service Manager"
  },
  sikar: {
    name: "Sikar",
    state: "Rajasthan",
    type: "Shekhawati Regional Desk",
    address: "Jaipur Road, Near SK Hospital, Sikar, Rajasthan 332001, India",
    landmark: "Jaipur Road, Near SK Hospital",
    pincode: "332001",
    mapQuery: "SK Hospital, Jaipur Road, Sikar, Rajasthan 332001",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Shekhawati Service Desk"
  },
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    type: "West India Logistics Branch",
    address: "Parel Medical Corridor near KEM Hospital, Mumbai, Maharashtra 400012, India",
    landmark: "Parel Medical Corridor near KEM Hospital",
    pincode: "400012",
    mapQuery: "KEM Hospital, Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "West India Commercial Manager"
  },
  ahmedabad: {
    name: "Ahmedabad",
    state: "Gujarat",
    type: "Gujarat State Distribution Hub",
    address: "Asarwa Civil Hospital Zone, Ahmedabad, Gujarat 380016, India",
    landmark: "Asarwa Civil Hospital Zone",
    pincode: "380016",
    mapQuery: "Civil Hospital Ahmedabad, Asarwa, Ahmedabad, Gujarat 380016",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "Gujarat Regional Lead"
  },
  chandigarh: {
    name: "Chandigarh",
    state: "Punjab / Haryana",
    type: "North India Regional Hub",
    address: "Sector 12 near PGIMER, Chandigarh, 160012, India",
    landmark: "Sector 12 near PGIMER",
    pincode: "160012",
    mapQuery: "Postgraduate Institute of Medical Education and Research, Sector 12, Chandigarh, 160012",
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: "North India Regional Desk"
  }
};

const POPULAR_DISTRICTS = [
  { slug: "jaipur", label: "Jaipur (HQ)" },
  { slug: "delhi", label: "Delhi NCR" },
  { slug: "kota", label: "Kota" },
  { slug: "jodhpur", label: "Jodhpur" },
  { slug: "udaipur", label: "Udaipur" },
  { slug: "bikaner", label: "Bikaner" },
  { slug: "ajmer", label: "Ajmer" },
  { slug: "alwar", label: "Alwar" },
  { slug: "bhilwara", label: "Bhilwara" },
  { slug: "sikar", label: "Sikar" },
  { slug: "mumbai", label: "Mumbai" },
  { slug: "ahmedabad", label: "Ahmedabad" },
  { slug: "chandigarh", label: "Chandigarh" }
];

function resolveDistrictInfo(districtQuery) {
  if (!districtQuery) return DISTRICT_DATABASE.jaipur;

  const cleanSlug = districtQuery
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

  if (DISTRICT_DATABASE[cleanSlug]) {
    return DISTRICT_DATABASE[cleanSlug];
  }

  const formattedName = districtQuery
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    name: formattedName,
    state: "India",
    type: `${formattedName} Central District Hub`,
    address: `Rajbiosis Private Limited - Central ${formattedName} Office, Medical Market & Civil Hospital Zone, ${formattedName}, India`,
    landmark: `Central Civil Hospital Zone, ${formattedName}`,
    pincode: "Central District Hub",
    mapQuery: `Rajbiosis Private Limited, ${formattedName}, India`,
    phone: "8318368383",
    altPhone: "",
    emergencyPhone: "8318368383",
    email: "mail@rajbiosis.com",
    manager: `${formattedName} Regional Team`
  };
}

function ContactPageContent({ city: propCity }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Extract district from prop, search param (?district= or ?city= or ?location=), or URL path
  const paramDistrict =
    searchParams?.get("district") ||
    searchParams?.get("city") ||
    searchParams?.get("location");

  const pathParts = pathname.split("/").filter(Boolean);
  const pathDistrict =
    pathParts.length > 0 && pathParts[0] !== "contact" ? pathParts[0] : null;

  const initialDistrictName = propCity || paramDistrict || pathDistrict || "jaipur";

  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrictName);
  const [districtDataFromDb, setDistrictDataFromDb] = useState(null);
  const [contactInfo, setContactInfo] = useState([
    { label: "Address", value: "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021, India" },
    { label: "Email", value: "mail@rajbiosis.com" },
    { label: "Phone Number", value: "8318368383" }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Sync state if prop or parameter changes
  useEffect(() => {
    if (propCity || paramDistrict || pathDistrict) {
      setSelectedDistrict(propCity || paramDistrict || pathDistrict);
    }
  }, [propCity, paramDistrict, pathDistrict]);

  const activeDistrict = useMemo(() => {
    return resolveDistrictInfo(selectedDistrict);
  }, [selectedDistrict]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Medical Equipment Quote",
    message: "",
  });

  // Fetch custom district data from DB if available
  useEffect(() => {
    const loadDistrictFromDb = async () => {
      if (!selectedDistrict) return;
      try {
        const cleanSlug = selectedDistrict.toLowerCase().trim();
        const response = await fetch(`/api/site-data?pageType=district&district=${encodeURIComponent(cleanSlug)}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });
        const json = await response.json().catch(() => ({}));
        if (json?.data) {
          setDistrictDataFromDb(json.data);
        } else {
          setDistrictDataFromDb(null);
        }
      } catch (err) {
        console.log("District data query notice:", err);
      }
    };
    loadDistrictFromDb();
  }, [selectedDistrict]);

  // Fetch contact info settings from DB
  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await fetch("/api/site-data?pageType=contact", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });
        const json = await response.json().catch(() => ({}));
        if (json?.data?.contactInfo && json.data.contactInfo.length > 0) {
          setContactInfo(json.data.contactInfo);
        }
      } catch (err) {
        console.log("Contact data query notice:", err);
      }
    };
    loadContact();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return toast.error("Full Name is required");
    }

    if (!form.phone.trim()) {
      return toast.error("Phone Number is required");
    }

    if (!form.message.trim()) {
      return toast.error("Message details are required");
    }

    try {
      setSubmitting(true);
      await fetch("/api/contact-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      }).then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) throw new Error(result.error || "Submission failed");
        return result;
      });

      toast.success(
        `Thank you! Your message for ${activeDistrict.name} has been submitted successfully.`
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "Medical Equipment Quote",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const phoneValue = getContactValue(contactInfo, ["Phone", "Phone Number", "Mobile", "Mobile Number", "Contact"]) || "8318368383";
  const phoneNumbers = parseContactValues(phoneValue);
  const displayPhone = phoneNumbers[0] || "8318368383";
  const rawPhone = displayPhone.replace(/[^0-9]/g, "");
  const emailValue = getContactValue(contactInfo, ["Email", "Email Address", "Mail"]) || "mail@rajbiosis.com";
  const email = parseContactValues(emailValue)[0] || "mail@rajbiosis.com";
  const centralAddress = getContactValue(contactInfo, ["Address", "Office Address"]) || "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021, India";

  const isJaipurOrHQ = !selectedDistrict || selectedDistrict.toLowerCase() === "jaipur";

  const dynamicAddress = districtDataFromDb?.address
    ? districtDataFromDb.address
    : (isJaipurOrHQ ? (centralAddress || activeDistrict.address) : (activeDistrict.address || centralAddress));

  const mapAddressQuery = encodeURIComponent(
    districtDataFromDb?.mapQuery || activeDistrict.mapQuery || dynamicAddress || centralAddress
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(true);
    toast.success("Phone number copied to clipboard!");
    setTimeout(() => setCopiedPhone(false), 3000);
  };

  const filteredDistricts = POPULAR_DISTRICTS.filter((d) =>
    d.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact Raj Biosis - Biomedical Equipment Supplier in ${activeDistrict.name}`,
    description: `Contact Raj Biosis in ${activeDistrict.name} for medical equipment inquiries, quotation requests, installation support, and AMC service.`,
    url: `https://aozallo.com/contact?district=${encodeURIComponent(
      activeDistrict.name.toLowerCase()
    )}`,
    mainEntity: {
      "@type": "Organization",
      name: "Rajbiosis Private Limited",
      telephone: displayPhone,
      email: email,
      address: {
        "@type": "PostalAddress",
        streetAddress: dynamicAddress,
        addressLocality: activeDistrict.name,
        addressRegion: activeDistrict.state,
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />

      {/* Hero Banner with District Focus */}
      <PageBanner
        title={`Contact Rajbiosis Private Limited - ${activeDistrict.name}`}
        subtitle={`Central biomedical equipment sales, technical service, AMC contracts, and 24/7 emergency ICU breakdown support across ${activeDistrict.name} & regional medical hubs.`}
      />

      {/* Main Contact Content */}
      <section className="py-14 sm:py-20 bg-slate-50 relative overflow-hidden">
        <div className="container-custom">
          {/* Interactive District / Location Selector Bar */}
          <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                    <Radio size={14} className="animate-pulse text-emerald-600" />
                    <span>Dynamic Location Desk Active</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Active District Desk:</span>
                  <span className="text-emerald-700 underline decoration-emerald-300 underline-offset-4">
                    {activeDistrict.name} ({activeDistrict.state})
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Central office address, map embed, and technical hotlines dynamically adjust for every district.
                </p>
              </div>

              {/* District Quick Search & Selection Badges */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative min-w-[220px]">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search or enter district..."
                    value={searchFilter}
                    onChange={(e) => {
                      setSearchFilter(e.target.value);
                      if (e.target.value.trim().length > 2) {
                        setSelectedDistrict(e.target.value.trim());
                      }
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <select
                  value={
                    POPULAR_DISTRICTS.some(
                      (d) => d.slug === selectedDistrict.toLowerCase()
                    )
                      ? selectedDistrict.toLowerCase()
                      : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value !== "custom") {
                      setSelectedDistrict(e.target.value);
                    }
                  }}
                  className="rounded-2xl border border-slate-200 bg-emerald-900 text-white font-bold px-4 py-2.5 text-xs outline-none cursor-pointer shadow-md hover:bg-slate-800 transition"
                >
                  {POPULAR_DISTRICTS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      📍 {item.label}
                    </option>
                  ))}
                  {!POPULAR_DISTRICTS.some(
                    (d) => d.slug === selectedDistrict.toLowerCase()
                  ) && (
                      <option value="custom">
                        📍 Custom: {activeDistrict.name}
                      </option>
                    )}
                </select>
              </div>
            </div>

            {/* District Fast Click Badges */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-bold text-[11px] uppercase mr-1 flex items-center gap-1">
                <Navigation size={12} />
                Quick District Select:
              </span>
              {filteredDistricts.slice(0, 10).map((d) => {
                const isActive =
                  selectedDistrict.toLowerCase() === d.slug;
                return (
                  <button
                    key={d.slug}
                    onClick={() => setSelectedDistrict(d.slug)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1 ${isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800"
                      }`}
                  >
                    <span>{d.label}</span>
                    {isActive && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Contact Numbers & Communication Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {/* Direct Central Helpline */}
            <div className="rounded-3xl bg-white p-6 border border-emerald-100 shadow-md flex flex-col justify-between hover:shadow-xl transition group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-inner">
                  <PhoneCall size={22} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Sales & Quotations</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                    Primary
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Direct phone desk for {activeDistrict.name}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={phoneHref(displayPhone) || "#"}
                    className="font-black text-emerald-700 text-lg hover:underline flex items-center gap-1"
                  >
                    <span>{displayPhone}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(displayPhone)}
                    title="Copy Phone Number"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition"
                  >
                    {copiedPhone ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Mon - Sat: 9 AM - 7 PM</span>
                <span className="text-emerald-600 font-bold">Instant Dial</span>
              </div>
            </div>

            {/* WhatsApp Live Support */}
            <div className="rounded-3xl bg-white p-6 border border-emerald-100 shadow-md flex flex-col justify-between hover:shadow-xl transition group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full pointer-events-none" />
              <div>
                <div className="h-12 w-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-inner">
                  <MessageSquare size={22} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">WhatsApp Live Chat</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Get instant catalog & quotes in {activeDistrict.name}
                </p>
                <a
                  href={`${whatsappHref(displayPhone) || "#"}?text=Hello%20Raj%20Biosis,%20I%20am%20contacting%20from%20${encodeURIComponent(
                    activeDistrict.name
                  )}%20for%20medical%20equipment%20and%20quotation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 !text-white font-extrabold text-xs px-4 py-2.5 shadow-md shadow-green-600/20 hover:bg-green-700 transition"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink size={14} />
                </a>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-green-600">
                <span>⚡ Live Support</span>
                <span>Avg 5 min reply</span>
              </div>
            </div>

            {/* 24/7 Breakdown & Service Hotline */}
            <div className="rounded-3xl bg-white p-6 border border-emerald-100 shadow-md flex flex-col justify-between hover:shadow-xl transition group relative overflow-hidden">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-inner">
                  <Headphones size={22} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Service & AMC Hotline</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                    24/7 ICU
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Emergency technical breakdown desk
                </p>
                <a
                  href={phoneHref(displayPhone) || "#"}
                  className="mt-4 inline-block font-black text-amber-700 text-base hover:underline"
                >
                  {displayPhone}
                </a>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
                <span>24/7 Emergency Support</span>
                <span>Engineers On-Call</span>
              </div>
            </div>

            {/* Official Email Inquiry */}
            <div className="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                  <Mail size={22} />
                </div>
                <h3 className="text-base font-extrabold text-white">Official Email Desk</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Send formal hospital purchase orders & tenders
                </p>
                <a
                  href={mailHref(email) || "#"}
                  className="mt-4 inline-block font-bold text-emerald-400 text-xs sm:text-sm hover:underline break-all"
                >
                  {email}
                </a>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Response in 2-4 Hours</span>
                <span className="text-emerald-400">Official Quotes</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Dynamic Address Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-xl space-y-6">
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200 mb-3">
                    📍 {activeDistrict.type}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Rajbiosis Private Limited
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    Central Operations • {activeDistrict.name}, {activeDistrict.state}
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">
                        Central District Office & Works Address
                      </h4>
                      <p className="mt-1 leading-relaxed text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {dynamicAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Landmark & Hub Zone</h4>
                      <p className="mt-1 text-slate-600 font-medium">
                        {activeDistrict.landmark} (Pincode: {activeDistrict.pincode})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Clock3 size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Operating Hours</h4>
                      <p className="mt-1 text-slate-600 font-medium">
                        Monday – Saturday: 9:00 AM – 7:00 PM
                      </p>
                      <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                        ⚡ 24/7 Breakdown Hotline for ICU & Emergency Equipment
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <a
                    href={`https://maps.google.com/?q=${mapAddressQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-emerald-600 !text-white font-bold text-xs px-5 py-3 transition shadow-md"
                  >
                    <span>Open {activeDistrict.name} in Google Maps</span>
                    <ExternalLink size={14} />
                  </a>

                  <button
                    onClick={() => copyToClipboard(dynamicAddress)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-3 transition"
                  >
                    <Copy size={14} />
                    <span>Copy Address</span>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-3xl p-7 text-white shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck className="text-amber-400" size={20} />
                  <span>ISO 9001:2015 Certified Biomedical Partner</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-emerald-100 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                    <span>Direct OEM Supplier in {activeDistrict.name} with Genuine Spares</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                    <span>Itemized Quotes with GST & Logistics Breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                    <span>On-Site Engineer Installation & Technician Training</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Dynamic Inquiry & Quotation Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                  Fast Equipment Inquiry Desk
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Location: <span className="text-emerald-700">{activeDistrict.name}</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Get Quotation for {activeDistrict.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-8">
                Fill out the form below to receive official brochures, itemized quotes, or schedule an on-site engineer visit in {activeDistrict.name}.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. clinic@hospital.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>


                </div>


                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Message / Equipment Requirements *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    placeholder={`Specify required diagnostic machines, quantities, or service needs for ${activeDistrict.name}...`}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 py-4 font-black text-white shadow-xl shadow-emerald-700/25 transition-all hover:opacity-95 hover:-translate-y-0.5 disabled:opacity-70 text-sm cursor-pointer"
                >
                  <Send size={18} />
                  <span>
                    {submitting
                      ? "Sending Message..."
                      : `Submit Quotation Request for ${activeDistrict.name}`}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Dynamic Full-Width Google Maps Embed centered on District */}
          <div className="mt-16 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                <MapPin size={18} className="animate-bounce" />
                <span>
                  Rajbiosis Private Limited • {activeDistrict.name} Central Location Map
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-semibold">
                Centered on: {activeDistrict.landmark}
              </span>
            </div>
            <div className="relative w-full h-[460px] bg-slate-100">
              <iframe
                key={selectedDistrict}
                src={`https://maps.google.com/maps?q=${mapAddressQuery}&z=13&output=embed`}
                width="100%"
                height="460"
                loading="lazy"
                allowFullScreen
                className="border-0 w-full h-full"
                title={`Rajbiosis ${activeDistrict.name} Location Map`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactSkeleton() {
  return (
    <div className="py-20 text-center text-slate-500 font-bold">
      Loading Contact Information & District Map...
    </div>
  );
}

export default function ContactPage({ city }) {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactPageContent city={city} />
    </Suspense>
  );
}