import Image from "next/image";
import Logo from "@/public/logo.svg";
import { ArrowUpRightIcon } from "lucide-react";

export function SiteNav() {
  return (
    <nav className="border-b px-6 py-2 bg-background">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <Image
            src={Logo}
            alt="Logo"
            width={16}
            className="invert dark:invert-0"
          />
          <h2 className="text-sm font-medium grid">
            <span>brijr/forms</span>
            <a
              href="https://github.com/brijr/forms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-0.5 transition-colors"
            >
              Github <ArrowUpRightIcon size={14} />
            </a>
          </h2>
        </div>
      </div>
    </nav>
  );
}
