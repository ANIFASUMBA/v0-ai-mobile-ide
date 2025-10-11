"use client"

import { Code2, Sparkles, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">
              CodeSpace<span className="text-primary">AI</span>
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm">
            Projects
          </Button>
          <Button variant="ghost" size="sm">
            Templates
          </Button>
          <Button variant="ghost" size="sm">
            Docs
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden md:flex">
            <Sparkles className="mr-2 h-4 w-4" />
            Get Started
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
