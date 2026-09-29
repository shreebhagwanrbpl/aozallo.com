"use client";
import { useContactInfo } from "@/lib/useContactInfo";
export default function DynamicPhoneLink({ className = "", label = "", prefix = "", children }) {
  const { primaryPhone, primaryPhoneHref } = useContactInfo();
  if (!primaryPhone) return null;
  return (
    <a href={primaryPhoneHref} className={className}>
      {children || `${prefix}${primaryPhone}`}
    </a>
  );
}
