import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-brown/10 bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-playfair text-brown/60 text-sm">
          © {new Date().getFullYear()} Eunseo. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/work" className="font-sans text-xs text-brown/50 hover:text-brown transition-colors tracking-widest uppercase">
            Work
          </Link>
          <Link href="/journal" className="font-sans text-xs text-brown/50 hover:text-brown transition-colors tracking-widest uppercase">
            Journal
          </Link>
          <Link href="/contact" className="font-sans text-xs text-brown/50 hover:text-brown transition-colors tracking-widest uppercase">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
