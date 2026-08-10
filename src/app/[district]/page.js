import Home from "@/app/page";

export async function generateMetadata({ params }) {
  const { district } = await params;
  const city = district
    ? district.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "India";

  return {
    title: `Biomedical Equipment & Diagnostic Solutions in ${city} | Raj Biosis`,
    description: `Leading supplier and maintenance partner of medical equipment, hematology analyzers, ICU monitors, and laboratory devices in ${city}.`,
    alternates: {
      canonical: "https://aozallo.com",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function DistrictPage({ params }) {
  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <Home city={city} />;
}