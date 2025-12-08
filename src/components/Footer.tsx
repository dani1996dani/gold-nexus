export const Footer = () => {
  return (
      <footer className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          {/* Changed to 4 columns to look more 'Institutional' */}
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">

            {/* Col 1: Logo & Tagline */}
            <div className="md:col-span-1">
              <h3 className="mb-3 font-sans text-2xl font-black text-yellow-400">Gold Nexus</h3>
              <p className="font-sans text-sm leading-relaxed text-neutral-400">
                The Global Gateway for Gold & Luxury.
              </p>
            </div>

            {/* Col 2: Company */}
            <div>
              <h4 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-yellow-400">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Operations (Renamed from Support) */}
            <div>
              <h4 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-yellow-400">
                Operations
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200">
                    Secure Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200">
                    How to Sell
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal (New Section He Asked For) */}
            <div>
              <h4 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-yellow-400">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200">
                    Risk Disclosure
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Delaware & Disclaimer */}
          <div className="border-t border-neutral-800 pt-12 text-center">
            <p className="font-sans text-xs text-neutral-500">
              Gold Nexus LLC. Registered in Delaware, USA. File Number: 10381659.
            </p>
            <p className="mt-2 font-sans text-[10px] text-neutral-600 max-w-2xl mx-auto">
              Disclaimer: Trading in precious metals involves significant risk. Prices are volatile and past performance is not indicative of future results. Gold Nexus does not provide financial advice.
            </p>
            <p className="mt-6 font-sans text-xs text-neutral-500">
              © {new Date().getFullYear()} Gold Nexus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  );
};