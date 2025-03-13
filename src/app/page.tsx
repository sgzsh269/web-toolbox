import Link from "next/link";
import { FileText, Merge } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const tools = [
    {
      title: "Markdown Renderer",
      description: "Write, preview, and export markdown content easily",
      icon: <FileText className="h-10 w-10 text-primary" />,
      href: "/tools/markdown",
    },
    {
      title: "PDF Merger",
      description: "Combine multiple PDF files into a single document",
      icon: <Merge className="h-10 w-10 text-primary" />,
      href: "/tools/pdf-merge",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Web Toolbox</h1>
        <p className="text-xl text-muted-foreground mb-8">
          A collection of client-side web tools to help with your daily tasks
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {tools.map((tool) => (
          <Card key={tool.href} className="hover:shadow-md transition-shadow">
            <Link href={tool.href} className="block h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                {tool.icon}
                <div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </section>

      <section className="mt-8 text-center">
        <p className="text-muted-foreground">
          All tools run in your browser - no data is sent to any server
        </p>
      </section>
    </div>
  );
}
