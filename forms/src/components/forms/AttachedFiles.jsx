"use client";

export default function AttachedFiles({ config, values, onChange }) {
  if (!config.documentFields || config.documentFields.length === 0) {
    return null;
  }
  return (
    <section className="space-y-4 py-6 border-b border-gray-100">
      <h2 className="text-base font-semibold text-gray-800">
        თანდართული დოკუმენტები
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {config.documentFields.map((field) => {
          const fileName = values[field.name] || "";
          return (
            <div key={field.name}>
              <label className="block text-sm text-gray-500 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-gray-500">*</span>}
              </label>
              <input
                type="file"
                onChange={(e) => {
                  return onChange(
                    config.proxyDocumentField.name,
                    e.target.files?.[0]?.name || "",
                  );
                }}
                className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-600 file:text-sm file:font-medium hover:file:bg-blue-100"
              />
              {fileName && (
                <p className="text-xs text-gray-500 mt-1">{fileName}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
