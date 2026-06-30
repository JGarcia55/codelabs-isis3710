import { getAllCodelabs } from "@/lib/codelabs";
import EditPageClient from "./client";

export function generateStaticParams() {
  const codelabs = getAllCodelabs();
  return codelabs.map((c) => ({ slug: c.slug }));
}

export default function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <EditPageClient params={params} />;
}
