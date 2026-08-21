async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return res.json();
}
export async function verifyApplicant(agencySlug, serviceSlug, personalNumber) {
  const data = await postJson(`/api/${agencySlug}/${serviceSlug}/verify`, {
    target: "applicant",
    personalNumber,
  });
  return data.fields;
}
export async function verifySubject(
  agencySlug,
  serviceSlug,
  subjectType,
  idValue,
) {
  const data = await postJson(`/api/${agencySlug}/${serviceSlug}/verify`, {
    target: "subject",
    subjectType,
    idValue,
  });
  return data.fields;
}
export async function submitApplication(agencySlug, serviceSlug, payload) {
  return postJson(`/api/${agencySlug}/${serviceSlug}/submit`, payload);
}