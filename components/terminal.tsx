"use client"

import { useState, useEffect } from "react"
import { TerminalIcon, Maximize2, Minimize2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TerminalProps {
  output?: string[]
  onClear?: () => void
}

export function Terminal({ output: externalOutput, onClear }: TerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [output, setOutput] = useState([
    "> Welcome to CodeSpaceAI Terminal",
    "> Ready to execute your code in 20+ languages...",
    "> Select a language and click Run to get started!",
  ])

  useEffect(() => {
    if (externalOutput && externalOutput.length > 0) {
      setOutput(externalOutput)
    }
  }, [externalOutput])

  const handleClear = () => {
    setOutput(["> Terminal cleared", "> Ready to execute your code..."])
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className={`border-t border-border bg-card transition-all ${isExpanded ? "h-96" : "h-48"}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Terminal Output</span>
          <span className="text-xs text-muted-foreground">({output.length} lines)</span>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="h-full overflow-auto p-4 font-mono text-sm">
        {output.map((line, i) => (
          <div
            key={i}
            className={`${
              line.startsWith(">")
                ? "text-primary"
                : line.includes("Error") || line.includes("error")
                  ? "text-red-500"
                  : line.includes("Success") || line.includes("✓")
                    ? "text-green-500"
                    : "text-foreground"
            }`}
          >
            {line}
          </div>
        ))}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-primary">$</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  )
}
