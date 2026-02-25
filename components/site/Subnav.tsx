"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/coins", label: "Coins" },
  { href: "/devs", label: "Devs" },
  { href: "/dev/apply", label: "Dev Signup" },
  { href: "/account", label: "Account" },
  { href: "/how-it-works", label: "How it works" }
];

export default function Subnav() {
  const pathname = usePathname();

  return (
    <div className="subnav-inner">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`navlink ${active ? "active" : ""}`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
