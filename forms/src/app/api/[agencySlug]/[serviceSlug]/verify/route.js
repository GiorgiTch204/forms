import { NextResponse } from "next/server";
// Also this part should be deleted (mock object) once real NAPR lookups
// are wired in below.
const MOCK_SUBJECT_VERIFY_RESULT = {
  "individual": {
    individualSurname: "გვარი (SDA-დან)",
    individualName: "სახელი (SDA-დან)",
    individualRegisteredAddress: "რეგისტრირებული მისამართი (SDA-დან)",
  },
  "entrepreneur": {
    entrepreneurCompanyName: "სახელწოდება (NAPR-დან)",
    entrepreneurLegalAddress: "იურიდიული მისამართი (NAPR-დან)",
    entrepreneurDirectorName: "სახელი (NAPR-დან)",
    entrepreneurDirectorSurname: "გვარი (NAPR-დან)",
    entrepreneurDirectorPersonalNumber: "პირადი ნომერი (NAPR-დან)",
  },
  "public-legal": {
    publicLegalCompanyName: "სახელწოდება (NAPR-დან)",
    publicLegalAddress: "იურიდიული მისამართი (NAPR-დან)",
    publicLegalDirectorName: "სახელი (NAPR-დან)",
    publicLegalDirectorSurname: "გვარი (NAPR-დან)",
    publicLegalDirectorPersonalNumber: "პირადი ნომერი (NAPR-დან)",
  },
};
const SLUG_PATTERN = /^[a-z0-9-]+$/;
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

  await new Promise((resolve) => setTimeout(resolve, 800));
  if (body.target === "applicant") {
    if (!body.personalNumber || !/^\d+$/.test(body.personalNumber)) {
      return NextResponse.json(
        { error: "valid personalNumber is required" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      fields: {
        applicantName: "სახელი (SDA-დან)",
        applicantSurname: "გვარი (SDA-დან)",
      },
    });
  }
  
  if (body.target === "subject") {
    if (!body.subjectType || !body.idValue) {
      return NextResponse.json(
        { error: "subjectType and idValue are required" },
        { status: 400 },
      );
    }
    //Here this part also has to be replaced with MOCK_SUBJECT_VERIFY_RESULT below
    // with real calls:
    const result = MOCK_SUBJECT_VERIFY_RESULT[body.subjectType];
    if (!result) {
      return NextResponse.json(
        { error: "unknown subjectType" },
        { status: 400 },
      );
    }
    return NextResponse.json({ fields: result });
  }
  return NextResponse.json({ error: "invalid target" }, { status: 400 });
}