import { getPublicMenu } from "@/app/actions/public-menu";
import { MenuGrid } from "@/components/public/MenuGrid";
import { Sparkles, Check, Crown } from "lucide-react";
import prisma from "@/lib/prisma";
import { MenuHero } from "@/components/public/MenuHero";

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
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3">
                Signature Packages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {packages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`group relative bg-white dark:bg-gray-900/50 rounded-[2.5rem] p-8 border transition-all duration-500 backdrop-blur-sm flex flex-col ${
                    i === 1
                      ? "border-amber-500 shadow-2xl shadow-amber-500/20 scale-105 z-10"
                      : "border-gray-100 dark:border-white/5 hover:border-amber-500/30 hover:shadow-xl hover:-translate-y-2 dark:hover:bg-gray-900/80"
                  }`}
                >
                  {i === 1 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>
                  )}

                  {pkg.tag && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30">
                      <Crown className="h-3 w-3" /> {pkg.tag}
                    </div>
                  )}

                  <div className="mb-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm h-10 line-clamp-2 px-4">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-center gap-1 mb-10">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-400 font-medium">/person</span>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {pkg.features.split(",").map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-4 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <div
                          className={`mt-0.5 p-1 rounded-full ${
                            i === 1
                              ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500"
                              : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      i === 1
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/25 active:scale-95"
                        : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-colors"
                    }`}
                  >
                    Select Package
                  </button>
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
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Looking for something <span className="italic">unique?</span>
          </h2>
          <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Our chefs love a challenge. Let's design a custom menu that tells
            your story through flavor, texture, and presentation.
          </p>
          <button className="bg-white text-amber-600 px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1 active:scale-95">
            Request Bespoke Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
