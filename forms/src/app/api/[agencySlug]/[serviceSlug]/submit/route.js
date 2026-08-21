import { NextResponse } from "next/server";
import generateSubmissionId from "../../../../../../lib/submissionId";
import generateSubmissionDate from "../../../../../../lib/submissionDate";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const BACKEND_SUBMIT_URL_PLACEHOLDER ="https://backend.gov.ge/api/submissions";

export async function POST(request, { params }) {
  const { agencySlug, serviceSlug } = await params;

  if (!SLUG_PATTERN.test(agencySlug) || !SLUG_PATTERN.test(serviceSlug)) {
    return NextResponse.json({ error: "invalid route" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!body.subjectType || !body.applicant || !body.subject) {
    return NextResponse.json(
      { error: "applicant, subjectType and subject are required" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    note: "placeholder response - no real backend call made yet",
    registrationNumber: generateSubmissionId(),
    submissionDate: generateSubmissionDate(),
    received: { agencySlug, serviceSlug, ...body },
  });
}