import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { description, language } = await request.json()

    const generateCode = (desc: string, lang: string): string => {
      const lowerDesc = desc.toLowerCase()

      // Common patterns
      if (lowerDesc.includes("hello world") || lowerDesc.includes("print hello")) {
        const templates: Record<string, string> = {
          python: 'print("Hello, World!")',
          javascript: 'console.log("Hello, World!");',
          typescript: 'console.log("Hello, World!");',
          java: 'System.out.println("Hello, World!");',
          c: 'printf("Hello, World!\\n");',
          cpp: 'cout << "Hello, World!" << endl;',
          csharp: 'Console.WriteLine("Hello, World!");',
          go: 'fmt.Println("Hello, World!")',
          rust: 'println!("Hello, World!");',
          ruby: 'puts "Hello, World!"',
          php: 'echo "Hello, World!\\n";',
        }
        return templates[lang] || 'print("Hello, World!")'
      }

      if (lowerDesc.includes("function") || lowerDesc.includes("method")) {
        if (lang === "python") {
          return `def my_function(param):\n    """Function description"""\n    result = param * 2\n    return result\n\n# Call the function\nprint(my_function(5))`
        } else if (lang === "javascript" || lang === "typescript") {
          return `function myFunction(param) {\n  // Function logic\n  const result = param * 2;\n  return result;\n}\n\nconsole.log(myFunction(5));`
        }
      }

      if (lowerDesc.includes("loop") || lowerDesc.includes("iterate")) {
        if (lang === "python") {
          return `# Loop through numbers\nfor i in range(10):\n    print(f"Number: {i}")\n\n# Loop through list\nitems = ["apple", "banana", "cherry"]\nfor item in items:\n    print(item)`
        } else if (lang === "javascript" || lang === "typescript") {
          return `// Loop through numbers\nfor (let i = 0; i < 10; i++) {\n  console.log(\`Number: \${i}\`);\n}\n\n// Loop through array\nconst items = ["apple", "banana", "cherry"];\nitems.forEach(item => console.log(item));`
        }
      }

      if (lowerDesc.includes("class") || lowerDesc.includes("object")) {
        if (lang === "python") {
          return `class MyClass:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        return f"Hello, {self.name}!"\n\n# Create instance\nobj = MyClass("Student")\nprint(obj.greet())`
        } else if (lang === "javascript" || lang === "typescript") {
          return `class MyClass {\n  constructor(name) {\n    this.name = name;\n  }\n  \n  greet() {\n    return \`Hello, \${this.name}!\`;\n  }\n}\n\n// Create instance\nconst obj = new MyClass("Student");\nconsole.log(obj.greet());`
        }
      }

      if (lowerDesc.includes("api") || lowerDesc.includes("fetch") || lowerDesc.includes("request")) {
        if (lang === "python") {
          return `import requests\n\n# Make API request\nresponse = requests.get("https://api.example.com/data")\ndata = response.json()\nprint(data)`
        } else if (lang === "javascript" || lang === "typescript") {
          return `// Fetch data from API\nfetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));`
        }
      }

      if (lowerDesc.includes("read file") || lowerDesc.includes("file")) {
        if (lang === "python") {
          return `# Read file\nwith open("file.txt", "r") as f:\n    content = f.read()\n    print(content)\n\n# Write file\nwith open("output.txt", "w") as f:\n    f.write("Hello, File!")`
        } else if (lang === "javascript" || lang === "typescript") {
          return `const fs = require('fs');\n\n// Read file\nconst content = fs.readFileSync('file.txt', 'utf8');\nconsole.log(content);\n\n// Write file\nfs.writeFileSync('output.txt', 'Hello, File!');`
        }
      }

      // Default: create a basic structure
      if (lang === "python") {
        return `# Generated from: "${description}"\n\ndef main():\n    # Your code here\n    print("Starting...")\n    # TODO: Implement ${description}\n    pass\n\nif __name__ == "__main__":\n    main()`
      } else if (lang === "javascript" || lang === "typescript") {
        return `// Generated from: "${description}"\n\nfunction main() {\n  // Your code here\n  console.log("Starting...");\n  // TODO: Implement ${description}\n}\n\nmain();`
      }

      return `// Generated code for: ${description}\n// TODO: Implement this functionality`
    }

    const code = generateCode(description, language)

    return NextResponse.json({
      success: true,
      code,
    })
  } catch (error) {
    console.error("[v0] Error converting voice to code:", error)
    return NextResponse.json({ success: false, error: "Failed to convert voice to code" }, { status: 500 })
  }
}
