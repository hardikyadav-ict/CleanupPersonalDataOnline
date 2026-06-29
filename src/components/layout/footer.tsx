import Link from "next/link";
import { Shield } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "Pricing", href: "/pricing" },
    { label: "For Business", href: "/for-business" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "https://blog.privacyshield.app" },
  ],
  "Opt Out Guides": [
    { label: "Whitepages.com Opt Out", href: "#" },
    { label: "TruthFinder Opt Out", href: "#" },
    { label: "Checkpeople Opt Out", href: "#" },
    { label: "True People Search Opt Out", href: "#" },
    { label: "All Data Broker Opt Out Guides", href: "#" },
  ],
  "Useful Links": [
    { label: "Digital Footprint Checker", href: "/digital-footprint-checker" },
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  Programs: [
    { label: "Affiliate", href: "#" },
    { label: "Refer a friend", href: "#" },
    { label: "Student Discount", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="text-white font-bold">PrivacyShield</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://x.com" className="hover:text-emerald-400 transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://youtube.com" className="hover:text-emerald-400 transition-colors" aria-label="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()}, PrivacyShield. All Rights Reserved.
          Your privacy is our mission.
        </div>
      </div>
    </footer>
  );
}
