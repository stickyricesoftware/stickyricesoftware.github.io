import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Cable,
  Building2,
  Factory,
  Ship,
  Database,
  Train,
  Download,
  Mail,
  Phone,
  MapPin,
  Layers,
  Shield,
  Scale,
  Wrench,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "#/" },
  { label: "Products", href: "#/products" },
  { label: "Industries", href: "#/industries" },
  { label: "Technical", href: "#/technical" },
  { label: "Downloads", href: "#/downloads" },
  { label: "Contact", href: "#/contact" },
];

const productData = {
  "cable-ladders": {
    name: "Cable Ladders",
    short: "High-strength GRP/FRP cable ladder systems designed for long spans, low weight, and corrosion resistance.",
    technical:
      "VANTA Cable Ladders are engineered for demanding industrial environments where low installed weight, corrosion resistance, and long-term structural stability matter. The system supports efficient routing of power, control, and instrumentation cables while reducing lifecycle maintenance compared with conventional metallic alternatives.",
    features: [
      "High strength-to-weight ratio for easier handling and installation",
      "Corrosion-resistant construction for aggressive environments",
      "Suitable for industrial, offshore, and infrastructure applications",
      "Modular accessories and fittings for layout flexibility",
      "Low maintenance over extended service life",
    ],
    applications: ["Offshore platforms", "Process plants", "Utilities", "Infrastructure", "Marine environments"],
    related: ["cable-trays", "modular-support-systems", "fittings-accessories"],
    table: [
      ["Material", "GRP/FRP composite"],
      ["Typical Length", "3 m / 6 m"],
      ["Load Class", "Project-specific"],
      ["Corrosion Resistance", "High"],
      ["Installation", "Modular bolted assembly"],
    ],
  },
  "cable-trays": {
    name: "Cable Trays",
    short: "Composite tray systems for controlled cable routing where lightweight construction and durability are required.",
    technical:
      "VANTA Cable Trays provide structured cable routing in industrial and commercial environments where corrosion, moisture, and lifecycle cost must be considered. The range is suited for general plant installations, utility buildings, and process areas requiring durable cable support with clean system integration.",
    features: [
      "Lightweight profile for easier on-site handling",
      "Corrosion-resistant material system",
      "Available with coordinated fittings and accessories",
      "Suitable for indoor and outdoor installations",
      "Supports efficient cable organization",
    ],
    applications: ["Data centers", "Industrial buildings", "Water treatment", "Oil and gas facilities", "Utility rooms"],
    related: ["cable-ladders", "conduit-systems", "fittings-accessories"],
    table: [
      ["Material", "GRP/FRP composite"],
      ["Width Range", "Project-specific"],
      ["Depth Options", "Multiple"],
      ["Environment", "Indoor / Outdoor"],
      ["Assembly", "Bolted system"],
    ],
  },
  "modular-support-systems": {
    name: "Modular Support Systems",
    short: "Composite modular support framework for cable, conduit, and multi-discipline support applications.",
    technical:
      "VANTA Modular Support Systems are designed as an integrated structural platform for supporting cable management, light equipment, and service routes in corrosive or weight-sensitive projects. The system combines engineered profiles, brackets, and connectors to create flexible support arrangements with practical installation logic.",
    features: [
      "Modular design for configurable support layouts",
      "Reduced weight compared with metallic support systems",
      "Corrosion resistance for aggressive environments",
      "Suitable for new projects and retrofit work",
      "Supports multi-discipline routing strategies",
    ],
    applications: ["Skids", "Process plants", "Utilities", "Offshore modules", "Industrial structures"],
    related: ["pipe-supports", "cable-ladders", "conduit-systems"],
    table: [
      ["Material", "Advanced composite"],
      ["System Type", "Modular structural support"],
      ["Connection Method", "Bolted"],
      ["Typical Use", "Cable / conduit / pipe support"],
      ["Design Basis", "Project load requirements"],
    ],
  },
  "conduit-systems": {
    name: "VANTA Conduit",
    short: "Composite conduit routing system for cable protection in demanding industrial and infrastructure environments.",
    technical:
      "VANTA Conduit extends the cable management platform to protected routing applications where environmental durability, corrosion resistance, and low maintenance are important. The system is intended for projects requiring organized cable protection with coordinated support integration.",
    features: [
      "Protective routing solution for cables",
      "Compatible with modular support arrangements",
      "Composite construction for harsh environments",
      "Low maintenance requirement",
      "Clean integration into wider system layouts",
    ],
    applications: ["Infrastructure", "Tunnels", "Utilities", "Industrial sites", "Marine installations"],
    related: ["modular-support-systems", "cable-trays", "pipe-supports"],
    table: [
      ["Material", "Composite conduit system"],
      ["Application", "Cable protection"],
      ["Support Integration", "Yes"],
      ["Corrosion Resistance", "High"],
      ["Installation", "System-based"],
    ],
  },
  "pipe-supports": {
    name: "Pipe Supports",
    short: "Composite pipe support solutions designed for corrosive environments and coordinated structural layouts.",
    technical:
      "VANTA Pipe Supports are developed for projects requiring corrosion-resistant support structures for light to medium service routing. The system is intended to simplify coordinated support design while reducing maintenance burden in exposed or chemically aggressive environments.",
    features: [
      "Corrosion-resistant support platform",
      "Compatible with modular support philosophy",
      "Reduced maintenance requirements",
      "Structured installation approach",
      "Suitable for process and utility areas",
    ],
    applications: ["Utilities", "Water treatment", "Chemical plants", "Marine environments", "Industrial process areas"],
    related: ["modular-support-systems", "conduit-systems", "fittings-accessories"],
    table: [
      ["Material", "Composite structural support"],
      ["Use", "Pipe and service support"],
      ["Configuration", "Project-specific"],
      ["Environment", "Corrosive / industrial"],
      ["Fixing", "Bolted assembly"],
    ],
  },
  "fittings-accessories": {
    name: "Fittings & Accessories",
    short: "System fittings, brackets, connectors, and installation accessories supporting the full VANTA range.",
    technical:
      "VANTA Fittings & Accessories complete the cable management and support offering with coordinated components for direction changes, transitions, structural connection, and system finishing. The range is designed to support practical installation while maintaining system consistency across the full platform.",
    features: [
      "Integrated with ladder, tray, and support systems",
      "Supports clean and efficient installation",
      "Available for multiple routing configurations",
      "Designed for consistent system compatibility",
      "Improves site assembly flexibility",
    ],
    applications: ["All product systems", "Direction changes", "Transitions", "Support nodes", "Project customization"],
    related: ["cable-ladders", "cable-trays", "modular-support-systems"],
    table: [
      ["Category", "Fittings / brackets / connectors"],
      ["Compatibility", "System-wide"],
      ["Function", "Routing and assembly"],
      ["Material", "Composite / coordinated hardware"],
      ["Use", "Installation support"],
    ],
  },
};

const products = Object.entries(productData).map(([slug, data]) => ({ slug, ...data }));

const industries = [
  {
    title: "Offshore & Marine",
    icon: Ship,
    text: "Composite cable management is well suited to marine and offshore environments where corrosion resistance, weight reduction, and low maintenance are important design considerations.",
    links: ["cable-ladders", "modular-support-systems", "pipe-supports"],
  },
  {
    title: "Oil & Gas",
    icon: Factory,
    text: "For process facilities and hazardous industrial sites, GRP/FRP systems support long-term durability while reducing maintenance associated with corrosion-prone structures.",
    links: ["cable-ladders", "cable-trays", "fittings-accessories"],
  },
  {
    title: "Infrastructure & Rail",
    icon: Train,
    text: "Infrastructure projects benefit from lightweight, durable systems that simplify installation and provide stable performance in exposed environments.",
    links: ["conduit-systems", "cable-trays", "modular-support-systems"],
  },
  {
    title: "Data Centers",
    icon: Database,
    text: "Structured cable routing, clean layouts, and corrosion-resistant materials support reliable installation across technical building environments.",
    links: ["cable-trays", "conduit-systems", "fittings-accessories"],
  },
  {
    title: "Industrial Plants",
    icon: Building2,
    text: "Industrial plants require practical support and cable management solutions with strong lifecycle performance and clear installation logic.",
    links: ["modular-support-systems", "pipe-supports", "cable-ladders"],
  },
];

function useHashRoute() {
  const getRoute = () => window.location.hash.replace(/^#/, "") || "/";
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-[0.18em]">VANTA</div>
              <div className="text-xs text-slate-500">Composite Cable Management Systems</div>
            </div>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                {item.label}
              </a>
            ))}
            <a
              href="#/contact"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              Request Quote
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-4 lg:px-8">
          <div className="lg:col-span-2">
            <div className="text-lg font-semibold tracking-[0.18em]">VANTA</div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Advanced composite cable management and modular support systems for demanding industrial environments.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Navigation</div>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {navItems.map((item) => (
                <div key={item.href}>
                  <a href={item.href} className="hover:text-slate-900">{item.label}</a>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Contact</div>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div>sales@vanta-example.com</div>
              <div>+60 12-345 6789</div>
              <div>Klang, Selangor, Malaysia</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{eyebrow}</div> : null}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-slate-600">{text}</p> : null}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
            Technical composite systems for industrial projects
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Advanced Composite Cable Management Systems for Demanding Environments
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            VANTA delivers engineered GRP/FRP cable management and modular support systems focused on reduced weight,
            corrosion resistance, practical installation, and long-term project value.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#/products" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5">
              View Products
            </a>
            <a href="#/contact" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900">
              Request Quote
            </a>
            <a href="#/downloads" className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-800 transition hover:-translate-y-0.5">
              Download Technical Data
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid gap-4"
        >
          <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <div className="text-sm text-slate-300">System focus</div>
            <div className="mt-3 text-2xl font-semibold">Performance-driven composite infrastructure</div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-slate-400">Material logic</div>
                <div className="mt-1 font-medium text-white">Corrosion resistance</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-slate-400">Project benefit</div>
                <div className="mt-1 font-medium text-white">Reduced installed weight</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-slate-400">Installation</div>
                <div className="mt-1 font-medium text-white">Modular assembly</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-slate-400">Lifecycle</div>
                <div className="mt-1 font-medium text-white">Low maintenance</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [Shield, "Corrosion resistance"],
              [Scale, "Weight reduction"],
              [Wrench, "Installation efficiency"],
            ].map(([Icon, text]) => (
              <div key={text} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="h-5 w-5 text-sky-700" />
                <div className="mt-3 text-sm font-medium text-slate-800">{text}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition">
      <div className="aspect-[16/10] rounded-[22px] border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200" />
      <h3 className="mt-5 text-xl font-semibold text-slate-900">{product.name}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{product.short}</p>
      <a
        href={`#/products/${product.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky-800 transition group-hover:gap-3"
      >
        View Details <ArrowRight className="h-4 w-4" />
      </a>
    </motion.div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Product Portfolio"
          title="Composite systems built around practical installation and long-term service performance"
          text="The VANTA range covers cable management and modular support applications with coordinated product groups designed for industrial projects."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <SectionTitle
            eyebrow="Industries"
            title="Suitable for environments where corrosion resistance and weight reduction matter"
            text="VANTA systems are positioned for sectors where lifecycle durability, cleaner installation logic, and reduced maintenance are key project drivers."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-5">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <a
                  key={industry.title}
                  href="#/industries"
                  className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white"
                >
                  <Icon className="h-5 w-5 text-sky-700" />
                  <div className="mt-4 text-lg font-semibold text-slate-900">{industry.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{industry.text}</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Key Advantages"
          title="Technical benefits that support design decisions and project value"
          text="The system is positioned around measurable engineering logic rather than broad claims."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Weight Reduction",
              text: "Reduced installed mass supports easier handling, simplified logistics, and lower permanent loads on structures.",
            },
            {
              title: "Corrosion Resistance",
              text: "Composite materials are suited to harsh environments where metallic systems may require ongoing maintenance or protection.",
            },
            {
              title: "Lifecycle Value",
              text: "Long-term durability and low maintenance support stronger whole-life value across industrial assets.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xl font-semibold text-slate-900">{item.title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ProductsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionTitle
        eyebrow="Products"
        title="VANTA product portfolio"
        text="A coordinated family of GRP/FRP cable management and support products for industrial and infrastructure projects."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductDetailPage({ slug }) {
  const product = productData[slug];
  if (!product) return <NotFound />;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="#/" className="hover:text-slate-900">Home</a>
        <ChevronRight className="h-4 w-4" />
        <a href="#/products" className="hover:text-slate-900">Products</a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionTitle eyebrow="Product Detail" title={product.name} text={product.technical} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">Key Features</div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {product.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">Application Areas</div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {product.applications.map((application) => (
                  <li key={application}>• {application}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="aspect-[16/11] rounded-[30px] border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="aspect-square rounded-[22px] border border-slate-200 bg-slate-100" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4 text-lg font-semibold text-slate-900">Technical Data</div>
          <table className="w-full text-left text-sm">
            <tbody>
              {product.table.map(([label, value]) => (
                <tr key={label} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-4 font-medium text-slate-700">{label}</td>
                  <td className="px-6 py-4 text-slate-600">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">Downloads</div>
          <div className="mt-4 space-y-3">
            {[
              "Technical Datasheet",
              "Dimensional Drawing",
              "Installation Guidance",
            ].map((doc) => (
              <a
                key={doc}
                href="#/downloads"
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
              >
                <span>{doc}</span>
                <Download className="h-4 w-4 text-sky-700" />
              </a>
            ))}
          </div>
          <a href="#/contact" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
            Request Quote
          </a>
        </div>
      </div>

      <div className="mt-14">
        <div className="mb-6 text-2xl font-semibold text-slate-900">Related Products</div>
        <div className="grid gap-6 md:grid-cols-3">
          {product.related.map((relatedSlug) => (
            <ProductCard key={relatedSlug} product={{ slug: relatedSlug, ...productData[relatedSlug] }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustriesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionTitle
        eyebrow="Industries"
        title="Application sectors"
        text="The VANTA system is intended for projects where corrosion resistance, low maintenance, and structural efficiency support long-term asset performance."
      />
      <div className="mt-10 space-y-6">
        {industries.map((industry) => {
          const Icon = industry.icon;
          return (
            <div key={industry.title} className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900">{industry.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{industry.text}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    GRP/FRP systems are used in this sector to reduce maintenance demands, improve corrosion performance,
                    and support cleaner lifecycle economics in exposed or aggressive operating conditions.
                  </p>
                </div>
                <div className="min-w-[260px] rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Relevant products</div>
                  <div className="mt-4 space-y-3">
                    {industry.links.map((slug) => (
                      <a key={slug} href={`#/products/${slug}`} className="flex items-center justify-between text-sm text-slate-700 hover:text-slate-900">
                        <span>{productData[slug].name}</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TechnicalPage() {
  const spanRows = useMemo(
    () => [
      ["Light Duty", "Up to 1.5 m", "General cable routing"],
      ["Medium Duty", "Up to 3.0 m", "Industrial plant applications"],
      ["Heavy Duty", "Project-specific", "High-load or long-span support design"],
    ],
    []
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionTitle
        eyebrow="Technical / Design"
        title="Engineering overview"
        text="This section is intended to support consultant, EPC, and project-engineering review by presenting the logic behind system use and design considerations."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {[
          ["Load Data", "Project loading should be assessed against span, support spacing, cable fill, and environmental conditions."],
          ["Material System", "Composite construction supports corrosion resistance, electrical non-conductivity, and lower maintenance demand."],
          ["Installation Philosophy", "System design focuses on modular assembly, coordinated fittings, and practical site installation."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4 text-lg font-semibold text-slate-900">Indicative Span Table</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Indicative Span</th>
                <th className="px-6 py-4 font-medium">Typical Use</th>
              </tr>
            </thead>
            <tbody>
              {spanRows.map((row) => (
                <tr key={row[0]} className="border-t border-slate-100">
                  {row.map((cell) => (
                    <td key={cell} className="px-6 py-4 text-slate-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">Engineering Advantages</div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>• Supports weight-sensitive projects where lower system mass is beneficial.</li>
            <li>• Suitable for corrosive environments where metallic degradation can drive maintenance cost.</li>
            <li>• Helps simplify long-term asset planning through reduced maintenance burden.</li>
            <li>• Can be coordinated across cable, conduit, and support applications for system consistency.</li>
          </ul>
          <div className="mt-6 aspect-[16/10] rounded-[24px] border border-dashed border-sky-200 bg-sky-50 p-5 text-sm text-sky-800">
            Optional diagram block: load path, support spacing concept, or system section visual.
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-[30px] border border-slate-200 bg-slate-900 p-8 text-white">
        <div className="text-2xl font-semibold">Related systems</div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["cable-ladders", "modular-support-systems", "pipe-supports"].map((slug) => (
            <a key={slug} href={`#/products/${slug}`} className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <div className="text-lg font-medium">{productData[slug].name}</div>
              <div className="mt-2 text-sm text-slate-300">{productData[slug].short}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadsPage() {
  const files = [
    ["Cable Ladder Datasheet", "PDF"],
    ["Cable Tray Datasheet", "PDF"],
    ["Modular Support System Guide", "PDF"],
    ["Installation Manual", "PDF"],
    ["Technical Design Guide", "PDF"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionTitle
        eyebrow="Downloads"
        title="Technical library"
        text="A structured document area for datasheets, installation manuals, and technical guidance."
      />
      <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        {files.map(([name, type], index) => (
          <a
            key={name}
            href="#"
            className={`flex items-center justify-between px-6 py-5 text-sm transition hover:bg-sky-50 ${index !== files.length - 1 ? "border-b border-slate-100" : ""}`}
          >
            <div>
              <div className="font-medium text-slate-900">{name}</div>
              <div className="mt-1 text-slate-500">{type} download</div>
            </div>
            <Download className="h-4 w-4 text-sky-700" />
          </a>
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionTitle
        eyebrow="Contact"
        title="Project and technical enquiries"
        text="Use the contact form or direct details below to request quotations, technical information, or project support."
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="space-y-5 text-sm text-slate-700">
            <a href="mailto:sales@vanta-example.com" className="flex items-center gap-3 hover:text-slate-900">
              <Mail className="h-4 w-4 text-sky-700" /> sales@vanta-example.com
            </a>
            <a href="tel:+60123456789" className="flex items-center gap-3 hover:text-slate-900">
              <Phone className="h-4 w-4 text-sky-700" /> +60 12-345 6789
            </a>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-sky-700" /> Klang, Selangor, Malaysia
            </div>
          </div>
          <div className="mt-8 aspect-[16/11] rounded-[24px] border border-slate-200 bg-slate-100 p-5 text-sm text-slate-500">
            Embedded Google Map placeholder
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-2 block font-medium text-slate-700">Name</span>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-sky-500" placeholder="Your name" />
            </label>
            <label className="text-sm">
              <span className="mb-2 block font-medium text-slate-700">Company</span>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-sky-500" placeholder="Company name" />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-2 block font-medium text-slate-700">Email</span>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-sky-500" placeholder="name@company.com" />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-2 block font-medium text-slate-700">Message</span>
              <textarea rows={6} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-sky-500" placeholder="Tell us about your project, product interest, or technical request" />
            </label>
          </div>
          <button className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5">
            Request a Quote
          </button>
        </div>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist in this website preview.</p>
      <a href="#/" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
        Back to Home
      </a>
    </section>
  );
}

export default function App() {
  const route = useHashRoute();

  let page;
  if (route === "/") page = <HomePage />;
  else if (route === "/products") page = <ProductsPage />;
  else if (route.startsWith("/products/")) page = <ProductDetailPage slug={route.replace("/products/", "")} />;
  else if (route === "/industries") page = <IndustriesPage />;
  else if (route === "/technical") page = <TechnicalPage />;
  else if (route === "/downloads") page = <DownloadsPage />;
  else if (route === "/contact") page = <ContactPage />;
  else page = <NotFound />;

  return <Layout>{page}</Layout>;
}
