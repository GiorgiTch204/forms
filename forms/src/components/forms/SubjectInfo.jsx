"use client";

import { validateDigitField } from "../../../lib/validation";

const EDITABLE_SUFFIXES = ["ActualAddress", "Phone", "Email"];

function getReferenceAddress(subjectType, fields) {
  if (subjectType === "individual") {
    return {
      name: "individualRegisteredAddress",
      label: "რეგისტრირებული მისამართი",
    };
  }
  const legalField = fields.find(
    (f) => f.name.endsWith("Address") && !f.name.endsWith("ActualAddress"),
  );
  return legalField ? { name: legalField.name, label: legalField.label } : null;
}

export default function SubjectInfo({
  config,
  subjectType,
  onSubjectTypeChange,
  values,
  onChange,
  onVerify,
  verifying,
  verified,
}) {
  const fields = subjectType ? config.subjectFields[subjectType] || [] : [];
  const idField = fields[0];
  const isEditableAfterVerify = (field) =>
    field.name === idField?.name ||
    EDITABLE_SUFFIXES.some((suffix) => field.name.endsWith(suffix));
  const verifyLabel =
    subjectType === "individual" ? "გადამოწმება (SDA)" : "გადამოწმება (NAPR)";
  const referenceAddress = getReferenceAddress(subjectType, fields);

  return (
    <section className="space-y-4 py-6 border-b border-gray-100">
      <h2 className="text-base font-semibold text-gray-800">
        სუბიექტის ინფორმაცია
      </h2>

      <div>
        <label className="block text-sm text-gray-500 mb-1">
          სუბიექტის ტიპი <span className="text-gray-500">*</span>
        </label>
        <select
          value={subjectType || ""}
          onChange={(e) => onSubjectTypeChange(e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
        >
          <option value="" disabled>
            აირჩიეთ სუბიექტის ტიპი
          </option>
          {config.subjectTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {subjectType && fields.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field) => {
            const isIdField = field.name === idField.name;
            const isActualAddress = field.name.endsWith("ActualAddress");
            const value = values[field.name] || "";
            const error = validateDigitField(value, field.placeholder);

            if (isIdField) {
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
                      className="px-4 py-2 rounded-md bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 disabled:opacity-50 whitespace-nowrap"
                    >
                      {verifying ? "მოწმდება..." : verifyLabel}
                    </button>
                    {verified && (
                      <span className="text-green-500 text-sm whitespace-nowrap">
                        გადამოწმდა
                      </span>
                    )}
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                  )}
                </div>
              );
            }

            const showAddressCheckbox =
              isActualAddress && Boolean(referenceAddress);
            const sameAsReference =
              showAddressCheckbox &&
              Boolean(values[referenceAddress.name]) &&
              value === values[referenceAddress.name];
            const readOnly =
              (!isEditableAfterVerify(field) && verified) || sameAsReference;

            return (
              <div
                key={field.name}
                className={isActualAddress ? "col-span-2" : ""}
              >
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
                  readOnly={readOnly}
                  className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 read-only:bg-gray-50 focus:outline-none focus:ring-1 ${
                    error
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-300"
                  }`}
                />

                {showAddressCheckbox && (
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <input
                      type="checkbox"
                      checked={sameAsReference}
                      onChange={(e) =>
                        onChange(
                          field.name,
                          e.target.checked
                            ? values[referenceAddress.name] || ""
                            : "",
                        )
                      }
                    />
                    იგივეა რაც {referenceAddress.label}
                  </label>
                )}
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}