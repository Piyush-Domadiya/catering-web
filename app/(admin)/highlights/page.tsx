import HighlightsClient from "@/components/admin/HighlightsClient";

export default function HighlightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Highlights
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage featured moments and highlights displayed on the homepage.
        </p>
      </div>

      <HighlightsClient />
    </div>
  );
}
