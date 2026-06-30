import { getAllCodelabs, getCodelab } from "@/lib/codelabs";
import StepViewer from "@/components/StepViewer";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const codelabs = getAllCodelabs();
  return codelabs.map((c) => ({ slug: c.slug }));
}

export default async function CodelabPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const codelab = getCodelab(slug);

  if (!codelab) {
    notFound();
  }

  return <StepViewer steps={codelab.steps} codelabTitle={codelab.title} />;
}
