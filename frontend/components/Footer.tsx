"use client";

import Link from "next/link";
import { BarChart3, MessageCircle, GitBranch, Users, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#" },
    { label: "Companies", href: "/companies/" },
    { label: "Investors", href: "/investors" },
    { label: "Products", href: "/products" },
    { label: "News", href: "/news" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: GitBranch, href: "#", label: "GitHub" },
  { icon: Users, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@graphone.ai", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Graph<span className="text-emerald-600">One</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 mb-4 max-w-xs">
              The global intelligence layer for the AI economy. Discover, track, and analyze AI companies, investors, and products.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partners / Logos Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            Trusted by leading AI companies
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {/* Logo placeholders - replace with actual logo images */}
            {["OpenAI", "Anthropic", "DeepMind", "Cohere", "Stability AI", "Midjourney"].map((name) => (
              <div
                key={name}
                className="h-8 px-4 rounded bg-white border border-gray-200 flex items-center justify-center"
                title={name}
              >
                <span className="text-xs font-medium text-gray-600">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GraphOne. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with ❤️ for the AI community
          </p>
        </div>
      </div>
    </footer>
  );
}