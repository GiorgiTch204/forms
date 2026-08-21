"use client";

import { useState } from "react";
import generateSubmissionId from "../../../lib/submissionId";
import generateSubmissionDate from "../../../lib/submissionDate";

export default function GeneralInfo({
  config,
  applicationType,
  onApplicationTypeChange,
}) {
  const [submissionId] = useState(() => generateSubmissionId());
  const [submissionDate] = useState(() => generateSubmissionDate());
  
  return (
    <section className="space-y-4 pb-6 border-b border-gray-100">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">{config.title}</h1>
        {config.description && (
          <p className="text-sm text-gray-500 mt-1">{config.description}</p>
        )}
      </div>

      {config.applicationType && config.applicationType.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">
            განაცხადის ტიპი
          </p>
          <div className="flex flex-col gap-2">
            {config.applicationType.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name="applicationType"
                  value={option.value}
                  checked={applicationType === option.value}
                  onChange={(e) => onApplicationTypeChange(e.target.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 text-sm">
        <div>
          <p className="font-medium text-gray-500">
            განაცხადის რეგისტრაციის ნომერი
          </p>
          <p className="text-gray-500">
            {submissionId || "ავტომატურად გენერირდება"}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-500">განაცხადის შექმნის თარიღი</p>
          <p className="text-gray-500">
            {submissionDate || "ავტომატურად გენერირდება"}
          </p>
        </div>
      </div>

      {config.pdfs && config.pdfs.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            დაკავშირებული დოკუმენტები
          </p>
          <ul className="space-y-1 text-sm">
            {config.pdfs.map((pdf) => (
              <li key={pdf.id}>
                <a
                  href={pdf.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 hover:underline"
                >
                  {pdf.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}