import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { language, projectType } = await request.json()

    const scaffolds: Record<string, Record<string, string>> = {
      python: {
        "web-app": `# Python Data Dashboard
# Simple data processing and visualization

import json
from datetime import datetime

class DataDashboard:
    def __init__(self):
        self.data = []
    
    def add_entry(self, name, value):
        entry = {
            'id': len(self.data) + 1,
            'name': name,
            'value': value,
            'timestamp': datetime.now().isoformat()
        }
        self.data.append(entry)
        return entry
    
    def get_summary(self):
        total = sum(item['value'] for item in self.data)
        avg = total / len(self.data) if self.data else 0
        return {
            'total': total,
            'average': avg,
            'count': len(self.data)
        }
    
    def display(self):
        print("\\n=== Data Dashboard ===")
        for item in self.data:
            print(f"{item['id']}. {item['name']}: {item['value']}")
        print("\\n--- Summary ---")
        summary = self.get_summary()
        print(f"Total: {summary['total']}")
        print(f"Average: {summary['average']:.2f}")
        print(f"Count: {summary['count']}")
        print("==================\\n")

# Demo
dashboard = DataDashboard()
dashboard.add_entry("Sales", 1500)
dashboard.add_entry("Revenue", 3200)
dashboard.add_entry("Users", 450)
dashboard.display()`,

        "data-analysis": `# Data Analysis Script
import json
from statistics import mean, median, stdev

# Sample dataset
data = {
    'sales': [1200, 1500, 1800, 1300, 2000, 1700, 1600],
    'expenses': [800, 900, 950, 850, 1100, 1000, 950],
    'customers': [45, 52, 48, 50, 65, 58, 55]
}

print("=== Data Analysis Report ===\\n")

for category, values in data.items():
    print(f"{category.upper()}:")
    print(f"  Mean: {mean(values):.2f}")
    print(f"  Median: {median(values):.2f}")
    print(f"  Std Dev: {stdev(values):.2f}")
    print(f"  Min: {min(values)}")
    print(f"  Max: {max(values)}")
    print(f"  Total: {sum(values)}")
    print()

# Calculate profit
profit = [s - e for s, e in zip(data['sales'], data['expenses'])]
print(f"PROFIT ANALYSIS:")
print(f"  Total Profit: {sum(profit)}")
print(f"  Average Profit: {mean(profit):.2f}")
print(f"  Best Day: {max(profit)}")
print(f"  Worst Day: {min(profit)}")`,

        "cli-tool": `# Command Line Tool
import sys

class CLITool:
    def __init__(self):
        self.commands = {
            'help': self.show_help,
            'calc': self.calculate,
            'reverse': self.reverse_text,
            'count': self.count_words
        }
    
    def show_help(self, *args):
        print("\\nAvailable commands:")
        print("  help - Show this help message")
        print("  calc <expression> - Calculate math expression")
        print("  reverse <text> - Reverse the text")
        print("  count <text> - Count words in text")
    
    def calculate(self, *args):
        try:
            expr = ' '.join(args)
            result = eval(expr)
            print(f"Result: {result}")
        except Exception as e:
            print(f"Error: {e}")
    
    def reverse_text(self, *args):
        text = ' '.join(args)
        print(f"Reversed: {text[::-1]}")
    
    def count_words(self, *args):
        text = ' '.join(args)
        words = text.split()
        print(f"Word count: {len(words)}")
        print(f"Character count: {len(text)}")
    
    def run(self, command, *args):
        if command in self.commands:
            self.commands[command](*args)
        else:
            print(f"Unknown command: {command}")
            self.show_help()

# Demo
tool = CLITool()
print("CLI Tool Ready!")
tool.run('help')
tool.run('calc', '5', '+', '3', '*', '2')
tool.run('reverse', 'Hello World')
tool.run('count', 'The quick brown fox jumps')`,

        "rest-api": `# Python Data Manager
# Simple CRUD operations without server framework

import json
from datetime import datetime

class DataManager:
    def __init__(self):
        self.items = []
        self.next_id = 1
    
    def create(self, name, description, price):
        item = {
            'id': self.next_id,
            'name': name,
            'description': description,
            'price': price,
            'created_at': datetime.now().isoformat()
        }
        self.items.append(item)
        self.next_id += 1
        print(f"✓ Created: {item['name']} (ID: {item['id']})")
        return item
    
    def read_all(self):
        print(f"\\n=== All Items ({len(self.items)}) ===")
        for item in self.items:
            print(f"ID {item['id']}: {item['name']} - Price: {item['price']}")
        return self.items
    
    def read_one(self, item_id):
        for item in self.items:
            if item['id'] == item_id:
                print(f"\\nFound: {json.dumps(item, indent=2)}")
                return item
        print(f"✗ Item {item_id} not found")
        return None
    
    def update(self, item_id, **kwargs):
        for item in self.items:
            if item['id'] == item_id:
                item.update(kwargs)
                print(f"✓ Updated item {item_id}")
                return item
        print(f"✗ Item {item_id} not found")
        return None
    
    def delete(self, item_id):
        for i, item in enumerate(self.items):
            if item['id'] == item_id:
                deleted = self.items.pop(i)
                print(f"✓ Deleted: {deleted['name']}")
                return deleted
        print(f"✗ Item {item_id} not found")
        return None

# Demo CRUD operations
manager = DataManager()
print("Data Manager initialized!\\n")

# Create
manager.create("Laptop", "High-performance laptop", 1299.99)
manager.create("Mouse", "Wireless mouse", 29.99)
manager.create("Keyboard", "Mechanical keyboard", 89.99)

# Read
manager.read_all()
manager.read_one(2)

# Update
manager.update(2, price=24.99)

# Delete
manager.delete(3)

# Final state
manager.read_all()`,
      },

      javascript: {
        "web-app": `// JavaScript Web Application (Browser)
// Simple Todo App

const todos = [];

function addTodo(text) {
  const todo = {
    id: Date.now(),
    text: text,
    completed: false
  };
  todos.push(todo);
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

function renderTodos() {
  console.log('\\n=== Todo List ===');
  todos.forEach(todo => {
    const status = todo.completed ? '✓' : '○';
    console.log(\`\${status} \${todo.text}\`);
  });
  console.log('================\\n');
}

// Demo
console.log('Welcome to Todo App!');
addTodo('Learn JavaScript');
addTodo('Build a project');
addTodo('Master coding');
toggleTodo(todos[0].id);
console.log('Total todos:', todos.length);`,

        "rest-api": `// JavaScript API Client (Browser)
// Fetch API wrapper for making HTTP requests

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`);
    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async put(endpoint, data) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async delete(endpoint) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'DELETE'
    });
    return response.json();
  }
}

// Demo usage
const api = new APIClient('https://jsonplaceholder.typicode.com');

console.log('Fetching data from API...');
api.get('/posts/1')
  .then(data => console.log('Post:', data))
  .catch(err => console.error('Error:', err));`,

        "cli-tool": `// JavaScript CLI-style Tool (Browser Console)
// Command processor for browser console

const commands = {
  help: () => {
    console.log('Available commands:');
    console.log('  help - Show this help message');
    console.log('  calc <expr> - Calculate expression');
    console.log('  reverse <text> - Reverse text');
    console.log('  random <min> <max> - Random number');
  },
  
  calc: (expr) => {
    try {
      const result = eval(expr);
      console.log('Result:', result);
    } catch (e) {
      console.error('Invalid expression');
    }
  },
  
  reverse: (text) => {
    console.log(text.split('').reverse().join(''));
  },
  
  random: (min, max) => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log('Random number:', num);
  }
};

function runCommand(input) {
  const [cmd, ...args] = input.split(' ');
  if (commands[cmd]) {
    commands[cmd](...args);
  } else {
    console.log('Unknown command. Type "help" for available commands.');
  }
}

// Demo
console.log('CLI Tool Ready!');
runCommand('help');
runCommand('calc 5 + 3 * 2');
runCommand('reverse Hello');
runCommand('random 1 100');`,
      },

      typescript: {
        "web-app": `// TypeScript Web Application (Browser)
// Task Manager with TypeScript

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

class TaskManager {
  private tasks: Task[] = [];

  addTask(title: string, priority: Task['priority'] = 'medium'): void {
    const task: Task = {
      id: Date.now(),
      title,
      completed: false,
      priority
    };
    this.tasks.push(task);
    this.displayTasks();
  }

  toggleTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.displayTasks();
    }
  }

  displayTasks(): void {
    console.log('\\n=== Task Manager ===');
    this.tasks.forEach(task => {
      const status = task.completed ? '✓' : '○';
      console.log(\`\${status} [\${task.priority}] \${task.title}\`);
    });
    console.log('===================\\n');
  }

  getStats(): void {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    console.log(\`Stats: \${completed}/\${total} completed\`);
  }
}

// Demo
const manager = new TaskManager();
console.log('Task Manager initialized!');
manager.addTask('Learn TypeScript', 'high');
manager.addTask('Build a project', 'medium');
manager.addTask('Write tests', 'low');
manager.toggleTask(manager.tasks[0].id);
manager.getStats();`,

        "rest-api": `// TypeScript API Client (Browser)
// Type-safe HTTP client

interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class TypedAPIClient {
  constructor(private baseURL: string) {}

  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    try {
      const response = await fetch(\`\${this.baseURL}\${endpoint}\`);
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw new Error(\`GET request failed: \${error}\`);
    }
  }

  async post<T, D>(endpoint: string, body: D): Promise<APIResponse<T>> {
    try {
      const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw new Error(\`POST request failed: \${error}\`);
    }
  }
}

// Demo
interface Post {
  id: number;
  title: string;
  body: string;
}

const api = new TypedAPIClient('https://jsonplaceholder.typicode.com');
console.log('Fetching post...');
api.get<Post>('/posts/1')
  .then(response => console.log('Post:', response.data))
  .catch(err => console.error('Error:', err));`,
      },
    }

    const code =
      scaffolds[language]?.[projectType] ||
      `// ${language} ${projectType} scaffold\n// Start building your ${projectType} here!\n\nconsole.log("Hello from ${language}!");`

    return NextResponse.json({
      success: true,
      code,
      language,
      projectType,
    })
  } catch (error) {
    console.error("[v0] Error generating code:", error)
    return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
  }
}
