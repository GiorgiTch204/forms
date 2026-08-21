import fs from "fs";
import path from "path";
import Link from "next/link";

function getAllServices() {
  
  const configDir = path.join(process.cwd(), "config");
  if (!fs.existsSync(configDir)) return [];
  const services = [];
  for (const agencySlug of fs.readdirSync(configDir)) {
    const agencyDir = path.join(configDir, agencySlug);
    if (!fs.statSync(agencyDir).isDirectory()) continue;
    for (const file of fs.readdirSync(agencyDir)) {
      if (!file.endsWith(".json")) continue;
      const filePath = path.join(agencyDir, file);
      const config = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      services.push({
        agencySlug: config.agencySlug,
        serviceSlug: config.serviceSlug,
        title: config.title,
        description: config.description,
      });
    }
  }
  return services;
}
export default function Home() {
  const services = getAllServices();
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        ხელმისაწვდომი სერვისები
      </h1>

      {services.length === 0 ? (
        <p className="text-sm text-gray-500">სერვისები არ მოიძებნა</p>
      ) : (
        <ul className="space-y-3">
          {services.map((service) => (
            <li key={`${service.agencySlug}/${service.serviceSlug}`}>
              <Link
                href={`/${service.agencySlug}/${service.serviceSlug}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h2 className="text-base font-medium text-gray-800">
                  {service.title}
                </h2>
                {service.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {service.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
