"use client";
import { useEffect, useMemo, useState } from "react";
import {
  flattenContactInfo,
  getContactValue,
  parseContactValues,
  phoneDigits,
  phoneHref,
  whatsappHref,
  mailHref,
} from "./contact-utils";
export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState([
    { label: "Address", value: "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021, India" },
    { label: "Email", value: "mail@rajbiosis.com" },
    { label: "Phone Number", value: "8318368383" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/site-data?pageType=contact", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json?.data?.contactInfo && json.data.contactInfo.length > 0) {
          setContactInfo(json.data.contactInfo);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const phoneValue = getContactValue(contactInfo, ["Phone", "Phone Number", "Mobile", "Mobile Number", "Contact"]) || "8318368383";
  const emailValue = getContactValue(contactInfo, ["Email", "Email Address", "Mail"]) || "mail@rajbiosis.com";
  const addressValue = getContactValue(contactInfo, ["Address", "Office Address"]) || "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021, India";

  const phones = useMemo(() => parseContactValues(phoneValue), [phoneValue]);
  const emails = useMemo(() => parseContactValues(emailValue), [emailValue]);

  return {
    contactInfo: flattenContactInfo(contactInfo),
    phones,
    emails,
    address: addressValue,
    primaryPhone: phones[0] || "8318368383",
    primaryPhoneHref: phoneHref(phones[0] || "8318368383"),
    primaryWhatsAppHref: whatsappHref(phones[0] || "8318368383"),
    primaryEmail: emails[0] || "mail@rajbiosis.com",
    primaryEmailHref: mailHref(emails[0] || "mail@rajbiosis.com"),
    loading,
  };
}
