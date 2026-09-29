export function flattenContactInfo(contactInfo) {
  if (!contactInfo) return [];
  if (Array.isArray(contactInfo)) {
    return contactInfo.flatMap((item) => {
      if (item && typeof item === "object") {
        const value = item.value ?? item.text ?? item.content ?? "";
        return [{ label: String(item.label ?? item.name ?? "").trim(), value: String(value ?? "").trim() }];
      }
      return [];
    });
  }
  if (typeof contactInfo === "object") {
    return Object.entries(contactInfo).map(([label, value]) => ({
      label: String(label).trim(),
      value: Array.isArray(value) ? value.join(", ") : String(value ?? "").trim(),
    }));
  }
  return [];
}

export function getContactValue(contactInfo, labels = []) {
  const normalized = new Set(labels.map((x) => String(x).toLowerCase().replace(/[^a-z0-9]/g, "")));
  const item = flattenContactInfo(contactInfo).find((x) =>
    normalized.has(x.label.toLowerCase().replace(/[^a-z0-9]/g, ""))
  );
  return item?.value || "";
}

export function parseContactValues(value) {
  return String(value || "")
    .split(/[\n,;/|]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function phoneDigits(value) {
  const raw = String(value || "").replace(/[^\d+]/g, "");
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function phoneHref(value) {
  const digits = phoneDigits(value);
  return digits ? `tel:+${digits}` : "";
}

export function whatsappHref(value) {
  const digits = phoneDigits(value);
  return digits ? `https://wa.me/${digits}` : "";
}

export function mailHref(value) {
  return value ? `mailto:${String(value).trim()}` : "";
}
