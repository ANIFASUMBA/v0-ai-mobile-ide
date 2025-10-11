#!/usr/bin/env python3
"""
Multi-Language Code Executor
Supports 20+ programming languages for the AI Mobile IDE
"""

import sys
import json
import subprocess
import tempfile
import os
from pathlib import Path

# Language configurations with file extensions and execution commands
LANGUAGE_CONFIG = {
    "python": {
        "extension": ".py",
        "command": ["python3", "{file}"],
        "template": "{code}"
    },
    "javascript": {
        "extension": ".js",
        "command": ["node", "{file}"],
        "template": "{code}"
    },
    "typescript": {
        "extension": ".ts",
        "command": ["ts-node", "{file}"],
        "template": "{code}"
    },
    "java": {
        "extension": ".java",
        "command": ["java", "{file}"],
        "template": "public class Main {{\n    public static void main(String[] args) {{\n{code}\n    }}\n}}",
        "compile": ["javac", "{file}"]
    },
    "c": {
        "extension": ".c",
        "command": ["{executable}"],
        "template": "#include <stdio.h>\n\nint main() {{\n{code}\n    return 0;\n}}",
        "compile": ["gcc", "{file}", "-o", "{executable}"]
    },
    "cpp": {
        "extension": ".cpp",
        "command": ["{executable}"],
        "template": "#include <iostream>\nusing namespace std;\n\nint main() {{\n{code}\n    return 0;\n}}",
        "compile": ["g++", "{file}", "-o", "{executable}"]
    },
    "csharp": {
        "extension": ".cs",
        "command": ["dotnet", "run"],
        "template": "using System;\n\nclass Program {{\n    static void Main() {{\n{code}\n    }}\n}}"
    },
    "go": {
        "extension": ".go",
        "command": ["go", "run", "{file}"],
        "template": "package main\n\nimport \"fmt\"\n\nfunc main() {{\n{code}\n}}"
    },
    "rust": {
        "extension": ".rs",
        "command": ["{executable}"],
        "template": "fn main() {{\n{code}\n}}",
        "compile": ["rustc", "{file}", "-o", "{executable}"]
    },
    "ruby": {
        "extension": ".rb",
        "command": ["ruby", "{file}"],
        "template": "{code}"
    },
    "php": {
        "extension": ".php",
        "command": ["php", "{file}"],
        "template": "<?php\n{code}\n?>"
    },
    "swift": {
        "extension": ".swift",
        "command": ["swift", "{file}"],
        "template": "import Foundation\n\n{code}"
    },
    "kotlin": {
        "extension": ".kt",
        "command": ["kotlin", "{file}"],
        "template": "fun main() {{\n{code}\n}}"
    },
    "scala": {
        "extension": ".scala",
        "command": ["scala", "{file}"],
        "template": "object Main extends App {{\n{code}\n}}"
    },
    "r": {
        "extension": ".r",
        "command": ["Rscript", "{file}"],
        "template": "{code}"
    },
    "perl": {
        "extension": ".pl",
        "command": ["perl", "{file}"],
        "template": "{code}"
    },
    "lua": {
        "extension": ".lua",
        "command": ["lua", "{file}"],
        "template": "{code}"
    },
    "bash": {
        "extension": ".sh",
        "command": ["bash", "{file}"],
        "template": "#!/bin/bash\n{code}"
    },
    "sql": {
        "extension": ".sql",
        "command": ["sqlite3", ":memory:"],
        "template": "{code}",
        "stdin": True
    },
    "dart": {
        "extension": ".dart",
        "command": ["dart", "{file}"],
        "template": "void main() {{\n{code}\n}}"
    },
    "elixir": {
        "extension": ".exs",
        "command": ["elixir", "{file}"],
        "template": "{code}"
    },
    "haskell": {
        "extension": ".hs",
        "command": ["runhaskell", "{file}"],
        "template": "main = do\n{code}"
    }
}

def execute_code(code: str, language: str) -> dict:
    """
    Execute code in the specified language
    Returns a dictionary with output and error information
    """
    if language not in LANGUAGE_CONFIG:
        return {
            "success": False,
            "output": "",
            "error": f"Language '{language}' is not supported. Supported languages: {', '.join(LANGUAGE_CONFIG.keys())}"
        }
    
    config = LANGUAGE_CONFIG[language]
    
    try:
        # Create temporary directory for execution
        with tempfile.TemporaryDirectory() as temp_dir:
            # Prepare code with template
            template = config.get("template", "{code}")
            formatted_code = template.replace("{code}", code)
            
            # Create source file
            file_path = os.path.join(temp_dir, f"main{config['extension']}")
            with open(file_path, 'w') as f:
                f.write(formatted_code)
            
            # Compile if needed
            if "compile" in config:
                executable_path = os.path.join(temp_dir, "main.out")
                compile_cmd = [
                    cmd.replace("{file}", file_path).replace("{executable}", executable_path)
                    for cmd in config["compile"]
                ]
                
                compile_result = subprocess.run(
                    compile_cmd,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if compile_result.returncode != 0:
                    return {
                        "success": False,
                        "output": compile_result.stdout,
                        "error": f"Compilation Error:\n{compile_result.stderr}"
                    }
                
                # Update command to use executable
                run_cmd = [
                    cmd.replace("{file}", file_path).replace("{executable}", executable_path)
                    for cmd in config["command"]
                ]
            else:
                run_cmd = [
                    cmd.replace("{file}", file_path)
                    for cmd in config["command"]
                ]
            
            # Execute the code
            if config.get("stdin"):
                # For languages that need stdin (like SQL)
                result = subprocess.run(
                    run_cmd,
                    input=formatted_code,
                    capture_output=True,
                    text=True,
                    timeout=10,
                    cwd=temp_dir
                )
            else:
                result = subprocess.run(
                    run_cmd,
                    capture_output=True,
                    text=True,
                    timeout=10,
                    cwd=temp_dir
                )
            
            if result.returncode == 0:
                return {
                    "success": True,
                    "output": result.stdout or "Code executed successfully (no output)",
                    "error": ""
                }
            else:
                return {
                    "success": False,
                    "output": result.stdout,
                    "error": f"Runtime Error:\n{result.stderr}"
                }
                
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "output": "",
            "error": "Execution timeout: Code took too long to execute (>10 seconds)"
        }
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": f"Execution Error: {str(e)}"
        }

def main():
    """Main entry point for the script"""
    if len(sys.argv) < 3:
        print(json.dumps({
            "success": False,
            "output": "",
            "error": "Usage: python multi_language_executor.py <language> <code>"
        }))
        sys.exit(1)
    
    language = sys.argv[1]
    code = sys.argv[2]
    
    result = execute_code(code, language)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
