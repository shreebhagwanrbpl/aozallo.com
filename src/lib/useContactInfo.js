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
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-data?pageType=contact", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => setContactInfo(json?.data?.contactInfo || []))
      .catch(() => setContactInfo([]))
      .finally(() => setLoading(false));
  }, []);

  const phoneValue = getContactValue(contactInfo, ["Phone", "Phone Number", "Mobile", "Mobile Number", "Contact"]);
  const emailValue = getContactValue(contactInfo, ["Email", "Email Address", "Mail"]);
  const addressValue = getContactValue(contactInfo, ["Address", "Office Address"]);

  const phones = useMemo(() => parseContactValues(phoneValue), [phoneValue]);
  const emails = useMemo(() => parseContactValues(emailValue), [emailValue]);

  return {
    contactInfo: flattenContactInfo(contactInfo),
    phones,
    emails,
    address: addressValue,
    primaryPhone: phones[0] || "",
    primaryPhoneHref: phoneHref(phones[0]),
    primaryWhatsAppHref: whatsappHref(phones[0]),
    primaryEmail: emails[0] || "",
    primaryEmailHref: mailHref(emails[0]),
    loading,
  };
}
