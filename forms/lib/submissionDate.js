export default function generateSubmissionDate() {
  return new Date().toLocaleDateString("ka-GE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}