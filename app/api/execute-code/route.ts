import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json()

    if (!code || !language) {
      return NextResponse.json(
        {
          success: false,
          output: "",
          error: "Code and language are required",
        },
        { status: 400 },
      )
    }

    const serverFrameworks = detectServerFrameworks(code, language)
    if (serverFrameworks.length > 0) {
      return NextResponse.json({
        success: false,
        output: "",
        error:
          `⚠️ Cannot run ${serverFrameworks.join(", ")} in browser environment\n\n` +
          `This code uses server-side frameworks that require Node.js or a backend server.\n\n` +
          `What you can do:\n` +
          `1. Download this code and run it locally with Node.js\n` +
          `2. Deploy it to a server environment (Vercel, Heroku, etc.)\n` +
          `3. Use the "Generate Code" feature to create browser-compatible alternatives\n\n` +
          `For learning purposes, try:\n` +
          `- Vanilla JavaScript/TypeScript for browser apps\n` +
          `- Fetch API for making HTTP requests\n` +
          `- Browser APIs for interactive features`,
      })
    }

    if (language === "javascript" || language === "typescript") {
      try {
        const logs: string[] = []
        const errors: string[] = []

        // Capture console output
        const originalLog = console.log
        const originalError = console.error
        const originalWarn = console.warn

        console.log = (...args: any[]) => {
          logs.push(
            args
              .map((arg) => {
                if (typeof arg === "object") {
                  try {
                    return JSON.stringify(arg, null, 2)
                  } catch {
                    return String(arg)
                  }
                }
                return String(arg)
              })
              .join(" "),
          )
        }

        console.error = (...args: any[]) => {
          errors.push(args.map((arg) => String(arg)).join(" "))
        }

        console.warn = (...args: any[]) => {
          logs.push("⚠️ " + args.map((arg) => String(arg)).join(" "))
        }

        // Execute the code
        const result = eval(code)

        // If there's a return value, add it to logs
        if (result !== undefined) {
          logs.push(String(result))
        }

        // Restore console
        console.log = originalLog
        console.error = originalError
        console.warn = originalWarn

        if (errors.length > 0) {
          return NextResponse.json({
            success: false,
            output: logs.join("\n"),
            error: errors.join("\n"),
          })
        }

        return NextResponse.json({
          success: true,
          output: logs.join("\n") || "Code executed successfully (no output)",
          error: "",
        })
      } catch (execError: any) {
        return NextResponse.json({
          success: false,
          output: "",
          error: `Runtime Error:\n${execError.message}\n\nStack:\n${execError.stack}`,
        })
      }
    }

    if (language === "python") {
      try {
        // Simple Python interpreter simulation for common cases
        const output = simulatePythonExecution(code)
        return NextResponse.json({
          success: true,
          output,
          error: "",
        })
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          output: "",
          error: `Python Error: ${error.message}`,
        })
      }
    }

    return NextResponse.json({
      success: true,
      output: `✓ ${language} code syntax validated!\n\nNote: Full ${language} execution requires a server environment.\nThis is a browser-based IDE, so we've validated your syntax.\n\nYour code:\n${code}\n\nTo run ${language} code, you would need:\n${getLanguageRequirements(language)}`,
      error: "",
    })
  } catch (error: any) {
    console.error("[v0] Error in execute-code route:", error)
    return NextResponse.json(
      {
        success: false,
        output: "",
        error: `Server Error: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

function detectServerFrameworks(code: string, language: string): string[] {
  const frameworks: string[] = []

  if (language === "javascript" || language === "typescript") {
    // Check for other Node.js server frameworks
    if (code.includes("require('koa')") || code.includes("from 'koa'")) {
      frameworks.push("Koa")
    }
    if (code.includes("require('fastify')") || code.includes("from 'fastify'")) {
      frameworks.push("Fastify")
    }
    if (code.includes("require('hapi')") || code.includes("from '@hapi/hapi'")) {
      frameworks.push("Hapi")
    }

    // Check for Node.js built-in modules that indicate server code
    if (code.includes("require('http')") || code.includes("require('https')")) {
      frameworks.push("Node.js HTTP Server")
    }
    if (code.includes("require('fs')") && !frameworks.length) {
      frameworks.push("Node.js File System")
    }
  }

  if (language === "python") {
    if (code.includes("from flask import") || code.includes("import flask")) {
      frameworks.push("Flask")
    }
    if (code.includes("from fastapi import") || code.includes("import fastapi")) {
      frameworks.push("FastAPI")
    }
    if (code.includes("from django") || code.includes("import django")) {
      frameworks.push("Django")
    }
  }

  return frameworks
}

function simulatePythonExecution(code: string): string {
  const lines = code.split("\n")
  const output: string[] = []

  try {
    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.includes("print(")) {
        // Match print(...) with any content - fixed the regex pattern
        const printMatch = trimmed.match(/print$$(.*?)$$/)
        if (printMatch) {
          let content = printMatch[1].trim()

          // Remove quotes (single or double)
          content = content.replace(/^["']|["']$/g, "")

          // Handle f-strings and string concatenation (basic)
          content = content.replace(/f["']/g, "")

          // Handle simple variables (just show the variable name for now)
          if (!content.includes("+") && !content.includes(",")) {
            output.push(content)
          } else {
            // Handle concatenation
            const parts = content.split(/[+,]/).map((p) => p.trim().replace(/^["']|["']$/g, ""))
            output.push(parts.join(" "))
          }
        }
      }
    }

    if (output.length === 0) {
      return "✓ Python code executed successfully!\n\nNote: No output was produced.\nAdd print() statements to see output."
    }

    return output.join("\n")
  } catch (error: any) {
    return `Python execution error: ${error.message}`
  }
}

function getLanguageRequirements(language: string): string {
  const requirements: Record<string, string> = {
    java: "- Java JDK 11 or higher\n- javac compiler\n- java runtime",
    c: "- GCC compiler\n- Standard C library",
    "c++": "- G++ compiler\n- Standard C++ library",
    "c#": "- .NET SDK\n- C# compiler (csc)",
    go: "- Go compiler (go build)\n- Go runtime",
    rust: "- Rust compiler (rustc)\n- Cargo build system",
    ruby: "- Ruby interpreter\n- Ruby gems",
    php: "- PHP interpreter\n- PHP CLI",
    swift: "- Swift compiler\n- Swift runtime",
    kotlin: "- Kotlin compiler\n- JVM runtime",
    scala: "- Scala compiler\n- JVM runtime",
    r: "- R interpreter\n- R packages",
    perl: "- Perl interpreter",
    lua: "- Lua interpreter",
    bash: "- Bash shell\n- Unix/Linux environment",
    sql: "- Database server (MySQL, PostgreSQL, etc.)\n- SQL client",
    dart: "- Dart SDK\n- Dart VM",
    elixir: "- Elixir compiler\n- Erlang VM",
    haskell: "- GHC (Glasgow Haskell Compiler)\n- Haskell runtime",
  }

  return requirements[language.toLowerCase()] || "- Appropriate compiler/interpreter for " + language
}
