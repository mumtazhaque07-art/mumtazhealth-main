import { useMemo } from "react";

/**
 * Lightweight markdown renderer for chat messages.
 * Supports: **bold**, *italic*, `code`, bullet lists, numbered lists, and links.
 * No external dependency needed — keeps bundle small.
 */
export function ChatMarkdown({ content, className }: { content: string; className?: string }) {
  const rendered = useMemo(() => renderMarkdown(content), [content]);
  return (
    <div
      className={`text-sm prose-chat ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInline(text: string): string {
  let result = escapeHtml(text);

  // Bold: **text**
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* (but not inside bold)
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Inline code: `code`
  result = result.replace(/`([^`]+)`/g, '<code class="bg-muted-foreground/10 px-1 py-0.5 rounded text-xs">$1</code>');

  // Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-2 hover:text-accent/80">$1</a>'
  );

  return result;
}

function renderMarkdown(markdown: string): string {
  const lines = markdown.split("\n");
  const output: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (!trimmed) {
      if (inList) {
        output.push(listType === "ol" ? "</ol>" : "</ul>");
        inList = false;
        listType = null;
      }
      continue;
    }

    // Bullet list: - item or • item
    const bulletMatch = trimmed.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
      if (!inList || listType !== "ul") {
        if (inList) output.push(listType === "ol" ? "</ol>" : "</ul>");
        output.push('<ul class="list-disc pl-4 space-y-0.5 my-1">');
        inList = true;
        listType = "ul";
      }
      output.push(`<li>${renderInline(bulletMatch[1])}</li>`);
      continue;
    }

    // Numbered list: 1. item
    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      if (!inList || listType !== "ol") {
        if (inList) output.push(listType === "ol" ? "</ol>" : "</ul>");
        output.push('<ol class="list-decimal pl-4 space-y-0.5 my-1">');
        inList = true;
        listType = "ol";
      }
      output.push(`<li>${renderInline(numberedMatch[1])}</li>`);
      continue;
    }

    // Close any open list before non-list content
    if (inList) {
      output.push(listType === "ol" ? "</ol>" : "</ul>");
      inList = false;
      listType = null;
    }

    // Heading: ### text (rendered as bold text, not a real heading in chat)
    const headingMatch = trimmed.match(/^#{1,4}\s+(.+)/);
    if (headingMatch) {
      output.push(`<p class="font-semibold mt-2 mb-0.5">${renderInline(headingMatch[1])}</p>`);
      continue;
    }

    // Regular paragraph
    output.push(`<p class="my-0.5">${renderInline(trimmed)}</p>`);
  }

  // Close any trailing list
  if (inList) {
    output.push(listType === "ol" ? "</ol>" : "</ul>");
  }

  return output.join("");
}
