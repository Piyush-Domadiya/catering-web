import HighlightsClient from "@/components/admin/HighlightsClient";

export default function HighlightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Highlights</h1>
        <p className="text-text-secondary">
          Manage featured moments and highlights displayed on the homepage.
        </p>
      </div>

      <HighlightsClient />
    </div>
  );
}
