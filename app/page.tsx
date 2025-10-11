"use client"

import { useState } from "react"
import { CodeEditor } from "@/components/code-editor"
import { AIAssistant } from "@/components/ai-assistant"
import { Header } from "@/components/header"
import { Terminal } from "@/components/terminal"

export default function Home() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "> Welcome to CodeSpaceAI Terminal",
    "> Ready to execute your code in 20+ languages...",
    "> Select a language and click Run to get started!",
  ])

  const handleRunCode = async (codeToRun: string, lang: string) => {
    setTerminalOutput([`> Executing ${lang} code...`, "> Please wait..."])

    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeToRun, language: lang }),
      })

      const result = await response.json()

      if (result.success) {
        setTerminalOutput([
          `> Executed ${lang} successfully ✓`,
          "> Output:",
          "─".repeat(50),
          result.output || "(no output)",
          "─".repeat(50),
          `> Execution completed in ${lang}`,
        ])
      } else {
        setTerminalOutput([
          `> Execution failed ✗`,
          "> Error:",
          "─".repeat(50),
          result.error || "Unknown error occurred",
          "─".repeat(50),
          `> Fix the errors and try again`,
        ])
      }
    } catch (error: any) {
      console.error("[v0] Error running code:", error)
      setTerminalOutput([
        `> Connection error ✗`,
        "> Error:",
        "─".repeat(50),
        error.message || "Failed to connect to execution server",
        "─".repeat(50),
        `> Please check your connection and try again`,
      ])
    }
  }

  const handleClearTerminal = () => {
    setTerminalOutput(["> Terminal cleared", "> Ready to execute your code..."])
  }

  const handleCodeGenerated = (generatedCode: string, generatedLanguage: string) => {
    setCode(generatedCode)
    setLanguage(generatedLanguage)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col lg:flex-row">
          <CodeEditor
            onRunCode={handleRunCode}
            code={code}
            language={language}
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
          />
          <AIAssistant onCodeGenerated={handleCodeGenerated} currentLanguage={language} />
        </div>
      </main>
      <Terminal output={terminalOutput} onClear={handleClearTerminal} />
    </div>
  )
}
