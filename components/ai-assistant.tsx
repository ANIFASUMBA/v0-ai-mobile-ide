"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, Send, Mic, Code, Bug, Package, Lightbulb, Settings, MicOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AIAssistantProps {
  onCodeGenerated?: (code: string, language: string) => void
  currentLanguage?: string
}

export function AIAssistant({ onCodeGenerated, currentLanguage = "python" }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI coding assistant. I can help you generate code, explain errors, suggest packages, and more. What would you like to build today?",
    },
  ])

  const [selectedProjectType, setSelectedProjectType] = useState("web-app")
  const [errorToExplain, setErrorToExplain] = useState("")

  const handleSend = async () => {
    if (!prompt.trim() || isProcessing) return

    const userMessage = { role: "user", content: prompt }
    setMessages([...messages, userMessage])
    const userPrompt = prompt
    setPrompt("")
    setIsProcessing(true)

    try {
      const response = await fetch("/api/voice-to-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: userPrompt,
          language: currentLanguage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I've generated code based on your description! Check the editor.`,
          },
        ])

        if (onCodeGenerated) {
          onCodeGenerated(data.code, currentLanguage)
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't generate code. Please try rephrasing your request.",
          },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "An error occurred. Please try again.",
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in your browser. Please use Chrome or Edge.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setPrompt(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleGenerateCode = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: currentLanguage,
          projectType: selectedProjectType,
        }),
      })

      const data = await response.json()

      if (data.success && onCodeGenerated) {
        onCodeGenerated(data.code, currentLanguage)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Generated a ${selectedProjectType} scaffold for ${currentLanguage}! Check the editor.`,
          },
        ])
      }
    } catch (error) {
      console.error("Error generating code:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExplainError = async () => {
    if (!errorToExplain.trim()) {
      alert("Please enter an error message to explain")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/explain-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorMessage: errorToExplain,
          language: currentLanguage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: `Explain this error: ${errorToExplain}` },
          { role: "assistant", content: data.explanation },
        ])
        setErrorToExplain("")
      }
    } catch (error) {
      console.error("Error explaining error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSuggestPackages = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/suggest-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: selectedProjectType,
          language: currentLanguage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const { packages, descriptions, install } = data.suggestions
        let message = `**Recommended Packages for ${currentLanguage} ${selectedProjectType}:**\n\n`

        packages?.forEach((pkg: string) => {
          message += `📦 **${pkg}**\n${descriptions?.[pkg] || ""}\n\n`
        })

        message += `\n**Installation:**\n\`\`\`\n${install}\n\`\`\``

        setMessages((prev) => [
          ...prev,
          { role: "user", content: `Suggest packages for ${selectedProjectType}` },
          { role: "assistant", content: message },
        ])
      }
    } catch (error) {
      console.error("Error suggesting packages:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSetupEnvironment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/setup-environment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: currentLanguage,
          projectType: selectedProjectType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const env = data.environment
        let message = `**Environment Setup for ${currentLanguage} ${selectedProjectType}:**\n\n`

        if (env.setup) {
          message += `${env.setup}\n\n`
        }

        if (env.dockerfile) {
          message += `**Dockerfile:**\n\`\`\`dockerfile\n${env.dockerfile}\n\`\`\`\n\n`
        }

        if (env.requirements) {
          message += `**requirements.txt:**\n\`\`\`\n${env.requirements}\n\`\`\`\n\n`
        }

        if (env.packageJson) {
          message += `**package.json:**\n\`\`\`json\n${JSON.stringify(env.packageJson, null, 2)}\n\`\`\``
        }

        setMessages((prev) => [
          ...prev,
          { role: "user", content: `Setup environment for ${selectedProjectType}` },
          { role: "assistant", content: message },
        ])
      }
    } catch (error) {
      console.error("Error setting up environment:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex w-full flex-col border-t border-border lg:w-96 lg:border-l lg:border-t-0">
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Assistant</h2>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex flex-1 flex-col">
        <TabsList className="mx-4 mt-3 grid w-auto grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-auto p-4">
            {messages.map((message, i) => (
              <div key={i} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-[85%] p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </Card>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <Card className="bg-card p-3">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </Card>
              </div>
            )}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Describe what you want to build..."
                className="flex-1"
                disabled={isProcessing}
              />
              <Button
                size="icon"
                variant={isListening ? "default" : "outline"}
                onClick={handleVoiceInput}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button size="icon" onClick={handleSend} disabled={isProcessing}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {isListening ? "🎤 Listening..." : "Tip: Use voice input or type your request"}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Project Type</label>
              <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-app">Web Application</SelectItem>
                  <SelectItem value="rest-api">REST API</SelectItem>
                  <SelectItem value="cli-tool">CLI Tool</SelectItem>
                  <SelectItem value="data-analysis">Data Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 p-4 bg-transparent"
              onClick={handleGenerateCode}
              disabled={isProcessing}
            >
              <Code className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="text-sm font-medium">Generate Code Scaffold</div>
                <div className="text-xs text-muted-foreground">Create starter template</div>
              </div>
            </Button>

            <div className="space-y-2">
              <label className="text-sm font-medium">Error Message</label>
              <Input
                value={errorToExplain}
                onChange={(e) => setErrorToExplain(e.target.value)}
                placeholder="Paste error message..."
                className="mb-2"
              />
              <Button
                variant="outline"
                className="h-auto w-full justify-start gap-3 p-4 bg-transparent"
                onClick={handleExplainError}
                disabled={isProcessing}
              >
                <Bug className="h-5 w-5 text-destructive" />
                <div className="text-left">
                  <div className="text-sm font-medium">Explain Error</div>
                  <div className="text-xs text-muted-foreground">Get beginner-friendly explanation</div>
                </div>
              </Button>
            </div>

            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 p-4 bg-transparent"
              onClick={handleSuggestPackages}
              disabled={isProcessing}
            >
              <Package className="h-5 w-5 text-accent" />
              <div className="text-left">
                <div className="text-sm font-medium">Suggest Packages</div>
                <div className="text-xs text-muted-foreground">Get library recommendations</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 p-4 bg-transparent"
              onClick={handleSetupEnvironment}
              disabled={isProcessing}
            >
              <Settings className="h-5 w-5 text-chart-3" />
              <div className="text-left">
                <div className="text-sm font-medium">Setup Environment</div>
                <div className="text-xs text-muted-foreground">Get Docker & config files</div>
              </div>
            </Button>
          </div>

          <Card className="mt-4 bg-secondary p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
              <Lightbulb className="h-4 w-4" />
              Pro Tip
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Use voice input to describe what you want to build, and I'll generate the code for you instantly! Works
              best in Chrome and Edge browsers.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
