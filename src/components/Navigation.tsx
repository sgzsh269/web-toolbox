import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";

const tools = [
  { name: "Markdown Renderer", href: "/tools/markdown" },
  { name: "PDF Merger", href: "/tools/pdf-merge" },
];

export function Navigation() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Web Toolbox</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-4">
          {tools.map((tool) => (
            <Button asChild variant="ghost" key={tool.href}>
              <Link href={tool.href}>{tool.name}</Link>
            </Button>
          ))}
        </nav>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tools.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <Link href={tool.href}>{tool.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
