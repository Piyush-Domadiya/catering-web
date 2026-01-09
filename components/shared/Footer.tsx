import {
  Utensils,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gray-50 dark:bg-[#050505] border-t border-gray-200 dark:border-white/5 transition-colors duration-500 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2.5 rounded-xl shadow-lg group-hover:glow-amber transition-all duration-300">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-amber-800 dark:group-hover:from-amber-400 dark:group-hover:to-amber-600 transition-all duration-300">
                Testful Affaire
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Making every event testful with our premium catering services.
              From weddings to corporate events, we bring the best flavors to
              your table.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-amber-500 dark:hover:bg-amber-500 text-gray-400 dark:text-gray-400 hover:text-white transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
                >
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              Services
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {[
                "Wedding Catering",
                "Birthday Parties",
                "Corporate Events",
                "Festival Catering",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {["Home", "Our Menu", "Event Gallery", "Contact Us"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              Contact Info
            </h3>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                </div>
                <span className="mt-1.5 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  info@testfulaffaire.com
                </span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                  <Phone className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                </div>
                <span className="mt-1.5 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  +1 (555) 000-0000
                </span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                  <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                </div>
                <span className="mt-1.5 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  123 Catering Lane, Foodie City
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5 text-center text-sm text-gray-500 dark:text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} Testful Affaire Catering. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
