import { Codelab } from "@/types";
import Link from "next/link";

export default function CodelabCard({ codelab }: { codelab: Codelab }) {
  return (
    <Link
      href={`/codelabs/${codelab.slug}`}
      className="block border border-step-border rounded-lg p-5 hover:shadow-md hover:border-primary/30 transition-all bg-white"
    >
      <h2 className="text-lg font-semibold text-foreground mb-2">
        {codelab.title}
      </h2>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {codelab.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {codelab.duration && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {codelab.duration} min
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {codelab.steps.length} pasos
        </span>
        {codelab.author && (
          <span className="flex items-center gap-1 ml-auto">
            {codelab.author}
          </span>
        )}
      </div>
      {codelab.tags && codelab.tags.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {codelab.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-step-active text-primary px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
