import { getAllCodelabsRaw } from "@/lib/codelabs";
import EditPageClient from "./client";

export function generateStaticParams() {
  const codelabs = getAllCodelabsRaw();
  return codelabs.map((c) => ({ slug: c.slug }));
}

export default function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <EditPageClient params={params} />;
}
