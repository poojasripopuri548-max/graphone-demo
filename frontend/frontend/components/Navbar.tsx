import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/graphone-logo.svg"
            alt="GraphOne logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-white">
            Graph<span className="text-indigo-400">One</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-zinc-400 sm:flex">
          <a className="transition-colors hover:text-white" href="#companies">
            Companies
          </a>
          <a className="transition-colors hover:text-white" href="#trending">
            Trending
          </a>
          <a
            className="transition-colors hover:text-white"
            href="https://github.com/poojasripopuri548-max/graphone-demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
