import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Users } from "lucide-react";
import prisma from "@/lib/prisma";
import { HighlightsGrid } from "../../components/public/HighlightsGrid";
import { HomeHero } from "../../components/public/HomeHero";
import { HomeServices } from "../../components/public/HomeServices";
import { HomeTestimonials } from "../../components/public/HomeTestimonials";

const partners = [
  "TechGlobal",
  "BlueHorizon",
  "VertexMedia",
  "StellarEvents",
  "UrbanNest",
];

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const highlights = await prisma.highlight.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const settings = await prisma.globalSettings.findFirst();

  return (
    <div className="flex flex-col gap-20 pb-20 bg-transparent transition-colors duration-500">
      <HomeHero settings={settings} />

      {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20">
        <div className="bg-bg-primary p-8 rounded-[2.5rem] shadow-2xl border border-border-color hover-glow">
          <p className="text-center text-xs font-bold text-text-muted uppercase tracking-widest mb-8">
            Trusted by Industry Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner) => (
              <span
                key={partner}
                className="text-2xl font-black text-text-primary"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      <HomeServices />

      {/* Highlights Section */}
      <section className="relative bg-bg-secondary py-24 text-text-primary transition-colors overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 gradient-mesh opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-primary">
                Recent Highlights
              </h2>
              <p className="text-text-muted text-lg">
                Glimpses into the unforgettable events we&apos;ve curated.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-amber-500 dark:text-amber-400 font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform hover-glow group"
            >
              View All Events{" "}
              <ArrowRight className="h-5 w-5 group-hover:glow-amber-sm" />
            </Link>
          </div>

          <HighlightsGrid highlights={highlights} />
        </div>
      </section>

      <HomeTestimonials testimonials={testimonials} />

      {/* About Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-radial-amber opacity-30 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative">
            <div className="relative h-[600px] rounded-[40px] overflow-hidden shadow-2xl hover-glow">
              <Image
                src="https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1964&auto=format&fit=crop"
                alt="Our Chef"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-amber-500 to-amber-600 p-10 rounded-[40px] shadow-2xl hidden md:block glow-amber">
              <div className="text-bg-primary">
                <div className="text-5xl font-bold mb-1">15+</div>
                <div className="text-sm font-medium opacity-80">
                  Years of Culinary Excellence
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-500/20">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
              A Passion for Food and Unforgettable Moments
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              At Tasteful Affaire, we believe that every event is an opportunity
              to create a masterpiece. Founded by culinary enthusiasts, our
              mission is to deliver exceptional taste with impeccable service.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-start gap-4 premium-card p-4 rounded-2xl">
                <div className="bg-amber-100 dark:bg-amber-500/20 p-3 rounded-2xl glow-amber-sm">
                  <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1">
                    Top Rated
                  </h4>
                  <p className="text-sm text-text-muted">
                    Consistently voted best caterer in the region.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 premium-card p-4 rounded-2xl">
                <div className="bg-amber-100 dark:bg-amber-500/20 p-3 rounded-2xl glow-amber-sm">
                  <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1">
                    Expert Team
                  </h4>
                  <p className="text-sm text-text-muted">
                    Over 50+ trained staff for seamless service.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 font-bold text-text-primary group hover-glow"
            >
              Explore Our Story
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
