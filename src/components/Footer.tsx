export const Footer = () => {
  return (
    <footer className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            <h3 className="mb-3 font-sans text-2xl font-black text-yellow-400">Gold Nexus</h3>
            <p className="font-sans text-sm leading-relaxed text-neutral-400">
              The Global Gateway for Gold & Luxury.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-yellow-400">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-yellow-400">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-sans text-sm text-neutral-400 transition-colors hover:text-neutral-200"
                >
                  Returns
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 pt-8">
          <div className="flex flex-col gap-6">
            <a
                href="#"
                className="font-sans text-sm text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Privacy Policy
            </a>
            <a
                href="#"
                className="font-sans text-sm text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Terms of Service
            </a>
            <p className="font-sans text-sm text-neutral-500">
              © {new Date().getFullYear()} Gold Nexus. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
