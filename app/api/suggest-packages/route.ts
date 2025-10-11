import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectType, language } = await request.json()

    const suggestions: Record<string, Record<string, any>> = {
      python: {
        "web-app": {
          packages: ["streamlit", "dash", "plotly", "requests"],
          descriptions: {
            streamlit: "Build interactive web apps with pure Python",
            dash: "Build analytical web applications",
            plotly: "Interactive graphing library",
            requests: "HTTP library for API calls",
          },
          install: "pip install streamlit dash plotly requests",
        },
        "data-analysis": {
          packages: ["pandas", "numpy", "matplotlib", "seaborn", "jupyter"],
          descriptions: {
            pandas: "Powerful data manipulation and analysis library",
            numpy: "Fundamental package for numerical computing",
            matplotlib: "Create static, animated, and interactive visualizations",
            seaborn: "Statistical data visualization based on matplotlib",
            jupyter: "Interactive notebook environment for data science",
          },
          install: "pip install pandas numpy matplotlib seaborn jupyter",
        },
        "rest-api": {
          packages: ["requests", "httpx", "pydantic", "python-dotenv"],
          descriptions: {
            requests: "Simple HTTP library for API calls",
            httpx: "Modern HTTP client with async support",
            pydantic: "Data validation using Python type annotations",
            "python-dotenv": "Load environment variables from .env files",
          },
          install: "pip install requests httpx pydantic python-dotenv",
        },
        "cli-tool": {
          packages: ["click", "rich", "typer", "colorama"],
          descriptions: {
            click: "Create beautiful command line interfaces",
            rich: "Rich text and beautiful formatting in the terminal",
            typer: "Build great CLIs with Python type hints",
            colorama: "Cross-platform colored terminal text",
          },
          install: "pip install click rich typer colorama",
        },
      },

      javascript: {
        "web-app": {
          packages: ["axios", "lodash", "date-fns", "validator"],
          descriptions: {
            axios: "Promise-based HTTP client for the browser",
            lodash: "Modern JavaScript utility library",
            "date-fns": "Modern JavaScript date utility library",
            validator: "String validation and sanitization",
          },
          install: "npm install axios lodash date-fns validator",
        },
        "rest-api": {
          packages: ["axios", "qs", "form-data", "jsonwebtoken"],
          descriptions: {
            axios: "Promise-based HTTP client",
            qs: "Query string parsing and stringifying",
            "form-data": "Create multipart/form-data streams",
            jsonwebtoken: "JSON Web Token implementation",
          },
          install: "npm install axios qs form-data jsonwebtoken",
        },
        "cli-tool": {
          packages: ["commander", "chalk", "inquirer", "ora"],
          descriptions: {
            commander: "Complete solution for node.js command-line interfaces",
            chalk: "Terminal string styling done right",
            inquirer: "Collection of common interactive CLI prompts",
            ora: "Elegant terminal spinner",
          },
          install: "npm install commander chalk inquirer ora",
        },
      },

      typescript: {
        "web-app": {
          packages: ["axios", "@types/node", "zod", "date-fns"],
          descriptions: {
            axios: "HTTP client with TypeScript support",
            "@types/node": "TypeScript definitions for Node.js",
            zod: "TypeScript-first schema validation",
            "date-fns": "Modern date utility library",
          },
          install: "npm install axios zod date-fns && npm install -D @types/node typescript",
        },
        "rest-api": {
          packages: ["axios", "zod", "jsonwebtoken", "@types/jsonwebtoken"],
          descriptions: {
            axios: "HTTP client",
            zod: "TypeScript-first validation",
            jsonwebtoken: "JWT implementation",
            "@types/jsonwebtoken": "TypeScript types for JWT",
          },
          install: "npm install axios zod jsonwebtoken && npm install -D @types/jsonwebtoken typescript",
        },
      },
    }

    const langSuggestions = suggestions[language]?.[projectType] || {
      packages: [],
      descriptions: {},
      install: `# Install packages for ${language} ${projectType}`,
    }

    return NextResponse.json({
      success: true,
      suggestions: langSuggestions,
    })
  } catch (error) {
    console.error("[v0] Error suggesting packages:", error)
    return NextResponse.json({ success: false, error: "Failed to suggest packages" }, { status: 500 })
  }
}
