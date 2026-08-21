import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ServiceForm from "@/components/forms/ServiceForm";
const SLUG_PATTERN = /^[a-z0-9-]+$/;
export default async function ServicePage({ params }) {
  const { agencySlug, serviceSlug } = await params;
  if (!SLUG_PATTERN.test(agencySlug) || !SLUG_PATTERN.test(serviceSlug)) {
    notFound();
  }
  const filePath = path.join(
    process.cwd(),
    "config",
    agencySlug,
    `${serviceSlug}.json`,
  );
  if (!fs.existsSync(filePath)) {
    notFound();
  }
  const config = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return <ServiceForm config={config} />;
}