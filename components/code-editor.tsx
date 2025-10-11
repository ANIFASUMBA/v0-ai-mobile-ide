"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Save, Code2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const LANGUAGES = [
  { value: "python", label: "Python", icon: "🐍" },
  { value: "javascript", label: "JavaScript", icon: "📜" },
  { value: "typescript", label: "TypeScript", icon: "📘" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "c", label: "C", icon: "🔧" },
  { value: "cpp", label: "C++", icon: "⚙️" },
  { value: "csharp", label: "C#", icon: "🎯" },
  { value: "go", label: "Go", icon: "🐹" },
  { value: "rust", label: "Rust", icon: "🦀" },
  { value: "ruby", label: "Ruby", icon: "💎" },
  { value: "php", label: "PHP", icon: "🐘" },
  { value: "swift", label: "Swift", icon: "🦅" },
  { value: "kotlin", label: "Kotlin", icon: "🎨" },
  { value: "scala", label: "Scala", icon: "🎭" },
  { value: "r", label: "R", icon: "📊" },
  { value: "perl", label: "Perl", icon: "🐪" },
  { value: "lua", label: "Lua", icon: "🌙" },
  { value: "bash", label: "Bash", icon: "💻" },
  { value: "sql", label: "SQL", icon: "🗄️" },
  { value: "dart", label: "Dart", icon: "🎯" },
  { value: "elixir", label: "Elixir", icon: "💧" },
  { value: "haskell", label: "Haskell", icon: "λ" },
]

const CODE_TEMPLATES: Record<string, string> = {
  python: `# Welcome to CodeSpaceAI
# Python Example

def greet(name):
    """A simple greeting function"""
    return f"Hello, {name}! Ready to code?"

print(greet("Student"))
print("Python is running!")`,

  javascript: `// JavaScript Example
console.log("Hello from JavaScript!");

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));`,

  typescript: `// TypeScript Example
const greeting: string = "Hello from TypeScript!";
console.log(greeting);

function add(a: number, b: number): number {
    return a + b;
}

console.log("5 + 3 =", add(5, 3));`,

  java: `System.out.println("Hello from Java!");
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;
}
System.out.println("Sum of 1-10: " + sum);`,

  c: `printf("Hello from C!\\n");
int factorial = 1;
for (int i = 1; i <= 5; i++) {
    factorial *= i;
}
printf("5! = %d\\n", factorial);`,

  cpp: `cout << "Hello from C++!" << endl;
int arr[] = {1, 2, 3, 4, 5};
int sum = 0;
for (int num : arr) {
    sum += num;
}
cout << "Sum: " << sum << endl;`,

  csharp: `Console.WriteLine("Hello from C#!");
int[] numbers = {1, 2, 3, 4, 5};
int sum = numbers.Sum();
Console.WriteLine($"Sum: {sum}");`,

  go: `fmt.Println("Hello from Go!")
numbers := []int{1, 2, 3, 4, 5}
sum := 0
for _, num := range numbers {
    sum += num
}
fmt.Printf("Sum: %d\\n", sum)`,

  rust: `println!("Hello from Rust!");
let numbers = vec![1, 2, 3, 4, 5];
let sum: i32 = numbers.iter().sum();
println!("Sum: {}", sum);`,

  ruby: `# Ruby Example
puts "Hello from Ruby!"
numbers = [1, 2, 3, 4, 5]
sum = numbers.sum
puts "Sum: #{sum}"`,

  php: `echo "Hello from PHP!\\n";
$numbers = [1, 2, 3, 4, 5];
$sum = array_sum($numbers);
echo "Sum: $sum\\n";`,

  swift: `print("Hello from Swift!")
let numbers = [1, 2, 3, 4, 5]
let sum = numbers.reduce(0, +)
print("Sum: \\(sum)")`,

  kotlin: `println("Hello from Kotlin!")
val numbers = listOf(1, 2, 3, 4, 5)
val sum = numbers.sum()
println("Sum: $sum")`,

  scala: `println("Hello from Scala!")
val numbers = List(1, 2, 3, 4, 5)
val sum = numbers.sum
println(s"Sum: $sum")`,

  r: `# R Example
print("Hello from R!")
numbers <- c(1, 2, 3, 4, 5)
sum <- sum(numbers)
print(paste("Sum:", sum))`,

  perl: `# Perl Example
print "Hello from Perl!\\n";
my @numbers = (1, 2, 3, 4, 5);
my $sum = 0;
$sum += $_ for @numbers;
print "Sum: $sum\\n";`,

  lua: `-- Lua Example
print("Hello from Lua!")
numbers = {1, 2, 3, 4, 5}
sum = 0
for _, num in ipairs(numbers) do
    sum = sum + num
end
print("Sum: " .. sum)`,

  bash: `echo "Hello from Bash!"
sum=0
for i in {1..10}; do
    sum=$((sum + i))
done
echo "Sum of 1-10: $sum"`,

  sql: `-- SQL Example
CREATE TABLE students (id INTEGER, name TEXT, grade INTEGER);
INSERT INTO students VALUES (1, 'Alice', 95);
INSERT INTO students VALUES (2, 'Bob', 87);
INSERT INTO students VALUES (3, 'Charlie', 92);
SELECT * FROM students WHERE grade > 90;`,

  dart: `print('Hello from Dart!');
var numbers = [1, 2, 3, 4, 5];
var sum = numbers.reduce((a, b) => a + b);
print('Sum: $sum');`,

  elixir: `# Elixir Example
IO.puts("Hello from Elixir!")
numbers = [1, 2, 3, 4, 5]
sum = Enum.sum(numbers)
IO.puts("Sum: #{sum}")`,

  haskell: `putStrLn "Hello from Haskell!"
let numbers = [1, 2, 3, 4, 5]
let total = sum numbers
putStrLn $ "Sum: " ++ show total`,
}

interface CodeEditorProps {
  onRunCode?: (code: string, language: string) => void
  code?: string
  language?: string
  onCodeChange?: (code: string) => void
  onLanguageChange?: (language: string) => void
}

export function CodeEditor({
  onRunCode,
  code: externalCode,
  language: externalLanguage,
  onCodeChange,
  onLanguageChange,
}: CodeEditorProps) {
  const [internalCode, setInternalCode] = useState(CODE_TEMPLATES.python)
  const [internalLanguage, setInternalLanguage] = useState("python")
  const [isRunning, setIsRunning] = useState(false)

  const code = externalCode !== undefined ? externalCode : internalCode
  const language = externalLanguage !== undefined ? externalLanguage : internalLanguage

  useEffect(() => {
    if (externalCode !== undefined && externalCode !== internalCode) {
      setInternalCode(externalCode)
    }
  }, [externalCode])

  useEffect(() => {
    if (externalLanguage !== undefined && externalLanguage !== internalLanguage) {
      setInternalLanguage(externalLanguage)
    }
  }, [externalLanguage])

  const handleLanguageChange = (newLanguage: string) => {
    const newCode = CODE_TEMPLATES[newLanguage] || "// Start coding..."

    if (onLanguageChange) {
      onLanguageChange(newLanguage)
    } else {
      setInternalLanguage(newLanguage)
    }

    if (onCodeChange) {
      onCodeChange(newCode)
    } else {
      setInternalCode(newCode)
    }
  }

  const handleCodeChange = (newCode: string) => {
    if (onCodeChange) {
      onCodeChange(newCode)
    } else {
      setInternalCode(newCode)
    }
  }

  const handleRunCode = async () => {
    if (onRunCode) {
      setIsRunning(true)
      await onRunCode(code, language)
      setIsRunning(false)
    }
  }

  const handleSave = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-1 flex-col border-r border-border">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-3">
          <Code2 className="h-4 w-4 text-primary" />
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <span className="flex items-center gap-2">
                    <span>{lang.icon}</span>
                    <span>{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" className="h-8" onClick={handleRunCode} disabled={isRunning}>
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="relative">
          <div className="absolute left-0 top-0 flex flex-col gap-2 pr-4 text-right text-xs text-muted-foreground">
            {code.split("\n").map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="min-h-[500px] w-full resize-none bg-transparent pl-12 font-mono text-sm leading-6 text-foreground outline-none"
            spellCheck={false}
            placeholder="Start coding..."
          />
        </div>
      </div>
    </div>
  )
}
