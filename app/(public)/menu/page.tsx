import { getPublicMenu } from "@/app/actions/public-menu";
import { MenuGrid } from "@/components/public/MenuGrid";
import { Check, Crown } from "lucide-react";
import prisma from "@/lib/prisma";
import { MenuHero } from "@/components/public/MenuHero";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

async function getPackages() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { price: "desc" }, // Order by price or any other logic
    });
    return packages;
  } catch (error) {
    console.error("Failed to fetch packages", error);
    return [];
  }
}

function parseFeatures(features: string): string[] {
  try {
    // Try to parse as JSON first (for seeded data)
    const parsed = JSON.parse(features);
    if (Array.isArray(parsed)) return parsed;
  } catch (_e) {
    // If parsing fails, treat it as comma-separated (for admin UI data)
  }
  return features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
}

export default async function MenuPage() {
  const { categories, items } = await getPublicMenu();
  const packages = await getPackages();

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-500">
      <MenuHero />
      {/* Packages Section */}
      {packages.length > 0 && (
        <div className="py-24 relative overflow-hidden">
          {/* Background Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-amber-500/5 to-transparent pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="text-amber-500 font-bold tracking-widest uppercase text-sm">
                All-Inclusive Experiences
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mt-3">
                Signature Packages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group relative bg-bg-primary rounded-[2.5rem] p-8 border border-border-color hover:border-amber-500/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm flex flex-col"
                >
                  {pkg.tag && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-amber-500 text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-slate-200 dark:shadow-amber-500/30">
                      <Crown className="h-3 w-3" /> {pkg.tag}
                    </div>
                  )}

                  <div className="mb-8 text-center">
                    <h3 className="text-xl font-bold text-text-primary mb-3">
                      {pkg.name}
                    </h3>
                    <p className="text-text-secondary text-sm h-10 line-clamp-2 px-4">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-center gap-1 mb-10">
                    <span className="text-5xl font-bold text-text-primary tracking-tight">
                      ₹{pkg.price}
                    </span>
                    <span className="text-text-muted font-medium">/person</span>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {parseFeatures(pkg.features).map((feature, idx) => (
                      <li
                        key={`${pkg.id}-feature-${idx}`}
                        className="flex items-start gap-4 text-sm text-text-secondary"
                      >
                        <div className="mt-0.5 p-1 rounded-full bg-bg-secondary text-text-muted">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="w-full">
                    <button className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-bg-secondary text-text-primary hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white hover:shadow-lg hover:shadow-amber-500/25 active:scale-95 duration-300">
                      Select Package
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Grid - Hydrated with Server Data */}
      <MenuGrid categories={categories || []} items={items || []} />

      {/* Bespoke CTA */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-500"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Looking for something <span className="italic">unique?</span>
          </h2>
          <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Let&apos;s design a custom menu that tells your story through
            flavor, texture, and presentation.
          </p>
          <Link href="/contact">
            <button className="bg-text-primary text-bg-primary px-12 py-5 rounded-full font-bold text-lg hover:bg-amber-600 hover:text-white transition-all shadow-2xl active:scale-95">
              Request Bespoke Consultation
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
