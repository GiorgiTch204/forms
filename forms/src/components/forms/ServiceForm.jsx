"use client";

import { useState } from "react";
import { validateDigitField, validateEmail } from "../../../lib/validation";
import {
  verifyApplicant,
  verifySubject,
  submitApplication,
} from "@/lib/apiClient";
import GeneralInfo from "./GeneralInfo";
import ApplicantInfo from "./ApplicantInfo";
import SubjectInfo from "./SubjectInfo";
import AttachedFiles from "./AttachedFiles";
import FeeSummary from "./FeeSummary";

export default function ServiceForm({ config }) {
  const [applicationType, setApplicationType] = useState(null);
  const [applicantValues, setApplicantValues] = useState({});
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [subjectType, setSubjectType] = useState(null);
  const [subjectValues, setSubjectValues] = useState({});
  const [subjectVerifying, setSubjectVerifying] = useState(false);
  const [subjectVerified, setSubjectVerified] = useState(false);
  const [hectares, setHectares] = useState("");
  const [documentValues, setDocumentValues] = useState({});
  const handleDocumentChange = (name, fileName) => {
    setDocumentValues((prev) =>
      Object.assign(Object.assign({}, prev), { [name]: fileName }),
    );
  };
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [verifyError, setVerifyError] = useState(null);
  const [subjectVerifyError, setSubjectVerifyError] = useState(null);
  const handleApplicantChange = (name, value) => {
    setApplicantValues((prev) =>
      Object.assign(Object.assign({}, prev), { [name]: value }),
    );
  };
  const handleVerify = async () => {
    const personalNumberField = config.applicantFields.find(
      (f) => f.name === "applicantPersonalNumber",
    );
    const currentValue = applicantValues["applicantPersonalNumber"] || "";
    const error = validateDigitField(
      currentValue,
      personalNumberField === null || personalNumberField === void 0
        ? void 0
        : personalNumberField.placeholder,
    );
    if (!currentValue || error) return;
    setVerifying(true);
    setVerifyError(null);
    try {
      const fields = await verifyApplicant(
        config.agencySlug,
        config.serviceSlug,
        currentValue,
      );
      setApplicantValues((prev) =>
        Object.assign(Object.assign({}, prev), fields),
      );
      setVerified(true);
    } catch (err) {
      setVerifyError(
        err instanceof Error ? err.message : "გადამოწმება ვერ მოხერხდა",
      );
    } finally {
      setVerifying(false);
    }
  };
  const handleSubjectTypeChange = (value) => {
    setSubjectType(value);
    setSubjectValues({});
    setSubjectVerified(false);
  };
  const handleSubjectChange = (name, value) => {
    setSubjectValues((prev) =>
      Object.assign(Object.assign({}, prev), { [name]: value }),
    );
  };

  const handleSubjectVerify = async () => {
    if (!subjectType) return;
    const fields = config.subjectFields[subjectType] || [];
    const idField = fields[0];
    const currentValue = idField ? subjectValues[idField.name] || "" : "";
    const error = idField
      ? validateDigitField(currentValue, idField.placeholder)
      : "no id field";
    if (!idField || !currentValue || error) return;
    setSubjectVerifying(true);
    setSubjectVerifyError(null);
    try {
      const fields = await verifySubject(
        config.agencySlug,
        config.serviceSlug,
        subjectType,
        currentValue,
      );
      setSubjectValues((prev) =>
        Object.assign(Object.assign({}, prev), fields),
      );
      setSubjectVerified(true);
    } catch (err) {
      setSubjectVerifyError(
        err instanceof Error ? err.message : "გადამოწმება ვერ მოხერხდა",
      );
    } finally {
      setSubjectVerifying(false);
    }
  };
  const canSubmit =
    verified && subjectVerified && Boolean(subjectType) && !submitting;

  const validateAllFields = () => {
    for (const field of config.applicantFields) {
      const value = applicantValues[field.name] || "";
      const error =
        field.type === "email"
          ? validateEmail(value)
          : validateDigitField(value, field.placeholder);
      if (error) return `${field.label}: ${error}`;
    }

    const subjectFields = subjectType
      ? config.subjectFields[subjectType] || []
      : [];
    for (const field of subjectFields) {
      const value = subjectValues[field.name] || "";
      const error =
        field.type === "email"
          ? validateEmail(value)
          : validateDigitField(value, field.placeholder);
      if (error) return `${field.label}: ${error}`;
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!subjectType || !canSubmit) return;

    const validationError = validateAllFields();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);
    try {
      const result = await submitApplication(
        config.agencySlug,
        config.serviceSlug,
        {
          applicationType,
          applicant: applicantValues,
          subjectType,
          subject: subjectValues,
          hectares,
          documents: documentValues,
        },
      );
      setSubmitResult(result);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "განაცხადის გაგზავნა ვერ მოხერხდა",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <GeneralInfo
        config={config}
        applicationType={applicationType}
        onApplicationTypeChange={setApplicationType}
      />
      <ApplicantInfo
        config={config}
        values={applicantValues}
        onChange={handleApplicantChange}
        onVerify={handleVerify}
        verifying={verifying}
        verified={verified}
      />
      {verifyError && (
        <div className="bg-red-50 border border-red-100 rounded-md px-4 py-3 text-sm text-red-700">
          {verifyError}
        </div>
      )}

      <SubjectInfo
        config={config}
        subjectType={subjectType}
        onSubjectTypeChange={handleSubjectTypeChange}
        values={subjectValues}
        onChange={handleSubjectChange}
        onVerify={handleSubjectVerify}
        verifying={subjectVerifying}
        verified={subjectVerified}
      />
      {subjectVerifyError && (
        <div className="bg-red-50 border border-red-100 rounded-md px-4 py-3 text-sm text-red-700">
          {subjectVerifyError}
        </div>
      )}
      <AttachedFiles
        config={config}
        values={documentValues}
        onChange={handleDocumentChange}
      />
      <FeeSummary
        config={config}
        hectares={hectares}
        onHectaresChange={setHectares}
      />

      <section className="space-y-3 py-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "იგზავნება..." : "განაცხადის გაგზავნა"}
        </button>

        {!verified || !subjectVerified ? (
          <p className="text-xs text-gray-500">
            გასაგზავნად საჭიროა განმცხადებლისა და სუბიექტის მონაცემების
            გადამოწმება.
          </p>
        ) : null}

        {(submitResult === null || submitResult === void 0
          ? void 0
          : submitResult.ok) && (
          <div className="bg-green-50 border border-green-100 rounded-md px-4 py-3 text-sm text-green-700">
            განაცხადი გაიგზავნა.{" "}
            {submitResult.registrationNumber && (
              <>რეგისტრაციის ნომერი: {submitResult.registrationNumber}</>
            )}
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 border border-red-100 rounded-md px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
      </section>
    </div>
  );
}