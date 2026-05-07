import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useState, useRef, useEffect, type ReactNode } from "react";
import logo from "@/assets/logo.png";

// ─── Smart nav helper ──────────────────────────────────────────────────────
function NavLink({
  to,
  onClick,
  className,
  children,
}: {
  to: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  if (to.startsWith("tel:") || to.startsWith("mailto:")) {
    return (
      <a href={to} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }

  const hashIdx = to.indexOf("#");
  const path = hashIdx !== -1 ? to.slice(0, hashIdx) : to;
  const hash = hashIdx !== -1 ? to.slice(hashIdx + 1) : null;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    onClick?.();
    navigate(path || "/");
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────
type MenuLink = { label: string; to: string };

type DropdownCategory = {
  id: "solutions" | "industries";
  label: string;
  to: string;
  links: MenuLink[];
  mostRequested: MenuLink[];
};

type SimpleCategory = {
  id: "how-it-works" | "about" | "contact";
  label: string;
  to: string;
};

type NavCategory = DropdownCategory | SimpleCategory;

function isDropdown(cat: NavCategory): cat is DropdownCategory {
  return cat.id === "solutions" || cat.id === "industries";
}

// ─── Data ──────────────────────────────────────────────────────────────────
const navCategories: NavCategory[] = [
  {
    id: "solutions",
    label: "Solutions",
    to: "/solutions",
    links: [
      { label: "Automotive IT Solutions",         to: "/solutions#automotive-it" },
      { label: "Fleet Technology & GPS Tracking",  to: "/solutions#fleet-technology" },
      { label: "Cybersecurity Support",            to: "/solutions#cybersecurity" },
      { label: "Custom Software Development",      to: "/solutions#custom-software" },
      { label: "Website Development",              to: "/solutions#website-development" },
      { label: "CRM & Booking Systems",            to: "/solutions#crm-booking" },
      { label: "Business Process Automation",      to: "/solutions#automation" },
      { label: "Data Reporting & Dashboards",      to: "/solutions#data-reporting" },
      { label: "Cloud & IT Support",               to: "/solutions#cloud-it" },
      { label: "CAD & 3D Modelling Support",       to: "/solutions#cad-3d" },
    ],
    mostRequested: [
      { label: "Security Setup",    to: "/solutions#cybersecurity" },
      { label: "Fleet Tracking",    to: "/solutions#fleet-technology" },
      { label: "Book Consultation", to: "/book-consultation" },
    ],
  },
  {
    id: "industries",
    label: "Industries",
    to: "/industries",
    links: [
      { label: "Repair Shops",                   to: "/industries#repair-shops" },
      { label: "Dealerships",                    to: "/industries#dealerships" },
      { label: "Fleet Operators",                to: "/industries#fleet-operators" },
      { label: "Transport Companies",            to: "/industries#transport-companies" },
      { label: "Logistics Businesses",           to: "/industries#logistics-businesses" },
      { label: "Mobility & Automotive Startups", to: "/industries#mobility-startups" },
    ],
    mostRequested: [
      { label: "Fleet Operators",  to: "/industries#fleet-operators" },
      { label: "Auto Dealerships", to: "/industries#dealerships" },
      { label: "Get a Quote",      to: "/book-consultation" },
      { label: "Contact Us",       to: "/contact" },
    ],
  },
  { id: "how-it-works", label: "How It Works", to: "/how-it-works" },
  { id: "about",        label: "About",        to: "/about" },
  { id: "contact",      label: "Contact",      to: "/contact" },
];

// ─── Mega Menu ─────────────────────────────────────────────────────────────
function MegaMenu({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  // null = no right panel (when How It Works / About / Contact is hovered)
  const [activeId, setActiveId] = useState<"solutions" | "industries" | null>(null);

  const activeDropdown = navCategories.find(
    (c) => c.id === activeId && isDropdown(c)
  ) as DropdownCategory | undefined;

  function handleSimpleClick(cat: SimpleCategory) {
    onClose();
    navigate(cat.to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className="fixed left-0 right-0 z-50 border-t-2 border-cyber-red shadow-2xl"
      style={{ top: "var(--header-height, 96px)" }}
    >
      <div className="flex" style={{ minHeight: 340 }}>

        {/* ── Left sidebar — all 5 items ── */}
        <div className="flex flex-col bg-cyber-navy" style={{ minWidth: 260, width: 260 }}>
          {navCategories.map((cat) => {
            if (isDropdown(cat)) {
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveId(cat.id)}
                  className={`flex w-full items-center justify-between px-6 py-3.5 text-left text-sm font-medium transition-colors ${
                    activeId === cat.id
                      ? "bg-white text-gray-900"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{cat.label}</span>
                  {activeId === cat.id && (
                    <ChevronRight className="size-3.5 shrink-0 text-gray-500" />
                  )}
                </button>
              );
            } else {
              // How It Works / About / Contact — hover clears panel, click navigates
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveId(null)}
                  onClick={() => handleSimpleClick(cat)}
                  className="flex w-full items-center px-6 py-3.5 text-left text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <span>{cat.label}</span>
                </button>
              );
            }
          })}
        </div>

        {/* ── Right panel — ONLY when Solutions or Industries is active ── */}
        {activeDropdown && (
          <div className="flex flex-1 gap-16 bg-white px-10 py-7">
            <div style={{ minWidth: 240 }}>
              <NavLink
                to={activeDropdown.to}
                onClick={onClose}
                className="mb-5 block border-b-2 border-cyber-red pb-2 text-xl font-black text-gray-900 hover:text-cyber-red hover:underline"
              >
                {activeDropdown.label}
              </NavLink>
              <ul className="space-y-3">
                {activeDropdown.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={onClose}
                      className="group flex items-start gap-2 text-sm text-cyber-navy"
                    >
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-cyber-red transition-transform group-hover:scale-125" />
                      <span className="underline underline-offset-2 group-hover:no-underline group-hover:text-cyber-red/70">
                        {link.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ minWidth: 240 }}>
              <ul className="space-y-3 mt-10">
                {activeDropdown.mostRequested.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.to}
                      onClick={onClose}
                      className="group flex items-start gap-2 text-sm text-cyber-navy"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gray-400 transition-colors group-hover:bg-cyber-red" />
                      <span className="underline underline-offset-2 group-hover:no-underline group-hover:text-cyber-red/70">
                        {link.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Mobile Menu ───────────────────────────────────────────────────────────
function MobileMenu({ onClose }: { onClose: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white" style={{ overflowY: "auto" }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <Link to="/" onClick={onClose} aria-label="PSCyberCore home">
          <img src={logo} alt="PSCyberCore" className="h-16 w-auto object-contain" />
        </Link>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2">
        {navCategories.map((cat) => (
          <div key={cat.id} className="border-b border-gray-100">
            {isDropdown(cat) ? (
              <>
                <button
                  className="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-gray-900"
                  onClick={() => setOpenSection(openSection === cat.id ? null : cat.id)}
                >
                  <span>{cat.label}</span>
                  <ChevronRight
                    className={`size-4 shrink-0 text-cyber-red transition-transform duration-200 ${
                      openSection === cat.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {openSection === cat.id && (
                  <div className="mb-3 space-y-1 rounded-lg border border-cyber-red/10 bg-gray-50 p-3">
                    <NavLink
                      to={cat.to}
                      onClick={onClose}
                      className="block rounded-md px-3 py-2 text-sm font-bold text-cyber-red hover:bg-cyber-red/10"
                    >
                      {cat.label} — Overview
                    </NavLink>
                    <div className="my-1 border-t border-gray-200" />
                    {cat.links.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-cyber-red/10 hover:text-cyber-red"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-cyber-red/40" />
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={cat.to}
                onClick={onClose}
                className="flex w-full items-center py-3.5 text-left text-sm font-semibold text-gray-900 hover:text-cyber-red"
              >
                {cat.label}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom CTA */}
      <div className="border-t border-gray-200 px-4 py-4 space-y-2">
        <a
          href="tel:+18258076307"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-cyber-red py-3 text-sm font-bold text-white"
        >
          <Phone className="size-4" /> Talk to an Expert
        </a>
        <a
          href="mailto:info@pscybercore.com"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-cyber-navy py-3 text-sm font-bold text-white"
        >
          ✉ info@pscybercore.com
        </a>
      </div>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
export function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Update --header-height CSS var
  useEffect(() => {
    if (headerRef.current) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerRef.current.offsetHeight}px`
      );
    }
  });

  // Close mega menu on outside click
  useEffect(() => {
    if (!megaOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [megaOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}

      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-border/80 bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78"
      >
        <div
          className="mx-auto flex max-w-screen-2xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 xl:px-12 xl:gap-6 2xl:px-16"
          style={{ minHeight: "4.5rem" }}
        >
          {/* Left — Logo stacked above MENU button */}
          <div className="flex min-w-0 flex-col items-center">
            <Link to="/" aria-label="PSCyberCore home" className="block lg:ml-0 -ml-8" style={{ height: "6rem", width: "12rem" }}>
              <img
                src={logo}
                alt="PSCyberCore"
                className="h-24 w-48 cursor-pointer object-contain transition-transform duration-300 hover:scale-105"
                style={{ transform: "scale(2.0)", transformOrigin: "center center", pointerEvents: "none" }}
                aria-label="PSCyberCore home"
              />
            </Link>

            {/* Desktop MENU button — old style */}
            <button
              className={`hidden lg:flex items-center gap-2 rounded-none border-0 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-cyber-red-foreground transition-colors ${
                megaOpen ? "bg-cyber-red/85" : "bg-cyber-red hover:bg-cyber-red/85"
              }`}
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onClick={() => setMegaOpen((v) => !v)}
            >
              <Menu className="size-4" />
              MENU
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Mobile MENU button */}
            <button
              className="flex lg:hidden items-center gap-2 rounded-none border-0 bg-cyber-red px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyber-red-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-3.5" />
              MENU
            </button>
          </div>

          {/* Right — CTA buttons */}
          <div className="flex shrink-0 items-center gap-2" style={{ marginTop: "-1.5rem" }}>
            {/* Desktop */}
            <a
              href="tel:+18258076307"
              className="hidden lg:flex items-center gap-2 rounded-md border border-cyber-red px-4 py-2 text-sm font-semibold text-cyber-red hover:bg-cyber-red hover:text-white transition-colors"
            >
              <Phone className="size-4" />
              +1 825 807 6307
            </a>
            <Link
              to="/book-consultation"
              className="hidden lg:flex items-center gap-2 rounded-md bg-cyber-navy px-5 py-2 text-sm font-bold text-cyber-navy-foreground hover:bg-cyber-navy/85 transition-colors"
            >
              Book Consultation
            </Link>

            {/* Mobile */}
            <a
              href="tel:+18258076307"
              className="flex lg:hidden items-center gap-1.5 rounded-md border border-cyber-red px-3 py-2 text-xs font-bold text-cyber-red whitespace-nowrap"
            >
              <Phone className="size-3.5 shrink-0" />
              Call Us
            </a>
            <Link
              to="/book-consultation"
              className="flex lg:hidden items-center gap-1.5 rounded-md bg-cyber-navy px-3 py-2 text-xs font-bold text-cyber-navy-foreground whitespace-nowrap"
            >
              Consult
            </Link>
          </div>
        </div>

        {megaOpen && (
          <MegaMenu onClose={() => setMegaOpen(false)} />
        )}
      </header>
    </>
  );
}
