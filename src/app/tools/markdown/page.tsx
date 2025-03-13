"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import "highlight.js/styles/github.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileDown, Copy } from "lucide-react";

const initialMarkdown = `# Markdown Renderer

## Example Content

This is a simple markdown editor with live preview. You can:

- Write markdown in the editor
- See the rendered output in the preview tab
- Export as HTML or copy the content
- Use all standard markdown features

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Table Example

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### GitHub Flavored Markdown

This supports **GitHub Flavored Markdown** features like:

- [x] Task lists
- [x] Tables
- [x] Strikethrough (~~like this~~)
- [x] Automatic links
- [x] Emoji shortcodes :rocket:
`;

export default function MarkdownPage() {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const exportHTML = () => {
    const html = document.querySelector(".markdown-preview")?.innerHTML;
    if (!html) return;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Markdown Renderer</h1>
        <p className="text-muted-foreground">
          Write markdown and see it rendered in real-time
        </p>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={copyMarkdown}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={exportHTML}>
          <FileDown className="h-4 w-4 mr-2" />
          Export HTML
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editor panel */}
        <div className="flex flex-col">
          <div className="rounded-t-md bg-muted px-4 py-2 text-sm font-medium border border-b-0">
            Edit
          </div>
          <Textarea
            className="min-h-[500px] font-mono rounded-t-none"
            value={markdown}
            onChange={handleTextChange}
            placeholder="Write your markdown here..."
          />
        </div>

        {/* Preview panel */}
        <div className="flex flex-col">
          <div className="rounded-t-md bg-muted px-4 py-2 text-sm font-medium border border-b-0">
            Preview
          </div>
          <div className="border rounded-t-none rounded-b-md p-4 min-h-[500px] prose prose-pre:max-w-full max-w-none markdown-preview overflow-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize, rehypeHighlight]}
              components={{
                // Override base components to add proper styling
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold my-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold my-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold my-2" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <table
                    className="border-collapse table-auto w-full my-4"
                    {...props}
                  />
                ),
                th: ({ node, ...props }) => (
                  <th className="border px-4 py-2 bg-muted" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="border px-4 py-2" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-primary hover:underline" {...props} />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    className="p-4 rounded bg-muted overflow-x-auto"
                    {...props}
                  />
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  if (inline) {
                    return (
                      <code
                        className="bg-muted px-1 py-0.5 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                ul: ({ node, ordered, ...props }) => (
                  <ul className="list-disc pl-6 my-4" {...props} />
                ),
                ol: ({ node, ordered, ...props }) => (
                  <ol className="list-decimal pl-6 my-4" {...props} />
                ),
                li: ({ node, ...props }) => <li className="my-1" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-muted pl-4 italic my-4"
                    {...props}
                  />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-6 border-muted" {...props} />
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
