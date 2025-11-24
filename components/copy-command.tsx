"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";

import { useState } from "react";

interface CopyCommandProps {
  command: string;
}

export function CopyCommand({ command }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button onClick={handleCopy} variant="outline">
      {copied ? (
        <Check className="h-3 w-3 text-green-500 shrink-0" />
      ) : (
        <Copy className="h-3 w-3 shrink-0" />
      )}
      <span className="md:hidden">Copy</span>
      <code className="text-xs font-mono text-muted-foreground truncate max-w-[400px] hidden md:inline">
        {command}
      </code>
    </Button>
  );
}
