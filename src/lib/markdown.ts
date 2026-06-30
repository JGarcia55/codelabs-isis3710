export interface ParsedStep {
  title: string
  content: string
  duration?: number
}

export function parseSteps(markdown: string): ParsedStep[] {
  const blocks = markdown.split(/<!--\s*step\s*-->/).filter((b) => b.trim());

  return blocks.map((block) => {
    const lines = block.trim().split("\n");
    const title = lines[0].replace(/^##\s*/, "").replace(/^#\s*/, "").trim();
    const content = lines.slice(1).join("\n").trim();
    const durationMatch = block.match(/<!--\s*duration:\s*(\d+)\s*-->/);
    const duration = durationMatch ? parseInt(durationMatch[1], 10) : undefined;

    return { title, content, duration };
  });
}

export function stepsToMarkdown(
  steps: { title: string; content: string; duration?: number }[]
): string {
  return steps
    .map((step, i) => {
      const header = i === 0 ? `# ${step.title}` : `## ${step.title}`;
      const duration = step.duration ? `\n\n<!-- duration: ${step.duration} -->` : "";
      const separator = i === 0 ? "" : "\n\n<!-- step -->\n\n";
      return `${separator}${header}\n\n${step.content}${duration}`;
    })
    .join("");
}
