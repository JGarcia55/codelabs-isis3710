import mammoth from "mammoth";

export interface WordParseResult {
  title: string
  steps: { title: string; content: string }[]
}

export async function parseWordDocx(file: File): Promise<WordParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const title =
    doc.querySelector("h1")?.textContent ||
    file.name.replace(/\.docx$/i, "");

  const steps: { title: string; content: string }[] = [];
  let currentStep: { title: string; content: string } | null = null;

  for (const el of Array.from(doc.body.children)) {
    const tag = (el as HTMLElement).tagName;
    if (tag === "H1" || tag === "H2") {
      if (currentStep) steps.push(currentStep);
      currentStep = {
        title: (el as HTMLElement).textContent || "",
        content: "",
      };
    } else if (currentStep) {
      currentStep.content += (el as HTMLElement).outerHTML + "\n";
    }
  }
  if (currentStep) steps.push(currentStep);

  return { title, steps };
}
