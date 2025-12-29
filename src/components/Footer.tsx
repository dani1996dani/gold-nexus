import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 py-16 text-white">
      <div className="container mx-auto px-4">
        {/* =========================================
            DESKTOP VERSION (Hidden on mobile)
           ========================================= */}
        <div className="hidden grid-cols-4 gap-12 md:grid">
          {/* COL 1: BRAND & VISION */}
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#D4AF37]">Gold Nexus</h3>
              <p className="text-sm font-medium tracking-wide text-gray-300">
                The Global Gold Trading Platform
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-gray-400">
              <div>
                <strong className="mb-1 block text-[#D4AF37]">Our Vision</strong>
                <p>
                  Gold Nexus is building the next-generation global platform for gold trading —
                  connecting buyers and sellers worldwide through transparency, advanced technology,
                  and secure infrastructure. Our mission is to revolutionize the gold market by
                  delivering a seamless user experience, full-service ecosystem, and the most
                  competitive pricing in the industry.
                </p>
              </div>
              <div>
                <strong className="mb-1 block text-[#D4AF37]">Our Mission</strong>
                <p>
                  To become the world’s leading digital gold marketplace by combining luxury-grade
                  experience, financial technology, and trust — empowering individuals and
                  institutions to trade gold simply, securely, and transparently.
                </p>
              </div>
            </div>
          </div>

          {/* COL 2: COMPANY & SERVICES */}
          <div className="space-y-8">
            {/* COMPANY */}
            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/info/about-us" className="hover:text-white">
                    About Gold Nexus
                  </Link>
                </li>
                <li>
                  <Link href="/info/vision" className="hover:text-white">
                    Vision & Mission
                  </Link>
                </li>
                <li>
                  <Link href="/info/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/info/compliance" className="hover:text-white">
                    Compliance & Regulation
                  </Link>
                </li>
                <li>
                  <Link href="/info/aml-kyc" className="hover:text-white">
                    AML / KYC Policy
                  </Link>
                </li>
                <li>
                  <Link href="/info/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/info/terms" className="hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/info/refund-policy" className="hover:text-white">
                    Refund & Return Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* COL 3: SERVICES */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/marketplace?categories=BAR" className="hover:text-white">
                  Gold Bars & Bullion Trading
                </Link>
              </li>
              <li>
                <Link href="/marketplace?categories=JEWELRY" className="hover:text-white">
                  Jewelry Marketplace
                </Link>
              </li>
              <li>
                <Link href="/info/verified-sellers" className="hover:text-white">
                  Verified Sellers Network
                </Link>
              </li>
              <li>
                <Link href="/info/shipping" className="hover:text-white">
                  Secure Global Shipping
                </Link>
              </li>
              <li>
                <Link href="/info/insurance" className="hover:text-white">
                  Insurance & Buyer Protection
                </Link>
              </li>
              <li>
                <Link href="/info/live-price" className="hover:text-white">
                  Live Gold Price Data
                </Link>
              </li>
              <li>
                <Link href="/info/institutional" className="hover:text-white">
                  Future Institutional & Hedging Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 4: SUPPORT & LEGAL */}
          <div className="space-y-8">
            {/* SUPPORT */}
            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/info/ai-support" className="hover:text-white">
                    AI Customer Support{' '}
                    <span className="block text-[10px] text-gray-500">
                      — 24/7 Automated Assistance
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/info/support-ticket" className="hover:text-white">
                    Open Support Ticket
                  </Link>
                </li>
                <li>
                  <Link href="/info/faq" className="hover:text-white">
                    Help Center & FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/info/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                Legal
              </h4>
              <div className="text-xs leading-relaxed text-gray-500">
                <p className="font-semibold text-gray-300">Gold Nexus LLC</p>
                <p>Registered in Delaware, USA</p>
                <p>Delaware State File Number: 10381659</p>
                <p className="mt-2 text-gray-600">
                  Registered Agent Address:
                  <br />
                  16192 Coastal Highway, Lewes, DE 19958
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            MOBILE VERSION (Visible on mobile only)
           ========================================= */}
        <div className="block space-y-8 text-center md:hidden">
          {/* HEADER */}
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#D4AF37]">Gold Nexus</h3>
            <p className="text-sm font-medium text-gray-300">The Global Gold Trading Platform</p>
            <div className="text-xs text-gray-500">
              <p>Gold Nexus LLC — Delaware, USA</p>
              <p>File No. 10381659</p>
            </div>
          </div>

          {/* VISION SHORT */}
          <div className="mx-auto max-w-xs px-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">
              Our Vision
            </h4>
            <p className="text-sm leading-relaxed text-gray-400">
              Revolutionizing global gold trading through transparency, technology, and trust.
            </p>
          </div>

          {/* COMPACT LINKS LIST */}
          <div className="space-y-3 pt-4 text-sm text-gray-400">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <Link href="/info/about-us" className="hover:text-white">
                About
              </Link>
              <Link href="/info/how-it-works" className="hover:text-white">
                How It Works
              </Link>
              <Link href="/marketplace" className="hover:text-white">
                Services
              </Link>
              <Link href="/info/contact" className="hover:text-white">
                Contact
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <Link href="/info/ai-support" className="hover:text-white">
                AI Support (24/7)
              </Link>
              <Link href="/info/faq" className="hover:text-white">
                FAQ
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
              <Link href="/info/terms" className="hover:text-white">
                Terms
              </Link>
              <span>•</span>
              <Link href="/info/privacy" className="hover:text-white">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/info/compliance" className="hover:text-white">
                Compliance
              </Link>
              <span>•</span>
              <Link href="/info/refund-policy" className="hover:text-white">
                Refunds
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT (Shared) */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center md:mt-16">
          <p className="text-xs text-gray-600">&copy; 2025 Gold Nexus LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
