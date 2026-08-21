"use client";

import { validateDigitField } from "../../../lib/validation";

export default function ApplicantInfo({
  config,
  values,
  onChange,
  onVerify,
  verifying,
  verified,
}) {
  const isProxy = Boolean(values["isProxy"]);
  return (
    <section className="space-y-4 py-6 border-b border-gray-100">
      <h2 className="text-base font-semibold text-gray-800">
        განმცხადებლის ინფორმაცია
      </h2>

      <div className="grid grid-cols-2 gap-4 ">
        {config.applicantFields.map((field) => {
          if (field.name === "applicantPersonalNumber") {
            const value = values[field.name] || "";
            const error = validateDigitField(value, field.placeholder);
            return (
              <div key={field.name} className="col-span-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-gray-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={field.placeholder}
                      value={value}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 ${
                        error
                          ? "border-red-300 focus:ring-red-300"
                          : "border-gray-200 focus:ring-blue-300"
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onVerify}
                    disabled={verifying || !value || Boolean(error)}
                    className="px-4 py-2 rounded-md bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 disabled:opacity-50"
                  >
                    {verifying ? "მოწმდება..." : "გადამოწმება"}
                  </button>
                  {verified && (
                    <span className="text-green-500 text-sm">გადამოწმდა</span>
                  )}
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
            );
          }
          const isAutoFilled =
            field.name === "applicantName" || field.name === "applicantSurname";
          const value = values[field.name] || "";
          const error = validateDigitField(value, field.placeholder);
          return (
            <div key={field.name}>
              <label className="block text-sm text-gray-500 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-gray-500">*</span>}
              </label>
              <input
                type={field.type === "email" ? "email" : "text"}
                inputMode={
                  field.placeholder?.includes("ციფრი") ? "numeric" : undefined
                }
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                readOnly={isAutoFilled && verified}
                className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 read-only:bg-gray-50 focus:outline-none focus:ring-1 ${
                  error
                    ? "border-red-300 focus:ring-red-300"
                    : "border-gray-200 focus:ring-blue-300"
                }`}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          id="isProxy"
          checked={isProxy}
          onChange={(e) => onChange("isProxy", e.target.checked)}
          className="accent-blue-500"
        />
        <label htmlFor="isProxy">მინდობილი პირი</label>
      </div>

      {isProxy && config.proxyDocumentField && (
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            {config.proxyDocumentField.label}
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              onChange(
                config.proxyDocumentField.name,
                e.target.files?.[0]?.name || "",
              )
            }
            className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-600 file:text-sm file:font-medium hover:file:bg-blue-100"
          />
          {values[config.proxyDocumentField.name] && (
            <p className="text-xs text-gray-500 mt-1">
              {values[config.proxyDocumentField.name]}
            </p>
          )}
        </div>
      )}
    </section>
  );
}