import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { errorMessage, language } = await request.json()

    const explanations: Record<string, (error: string) => string> = {
      python: (error) => {
        if (error.includes("SyntaxError")) {
          return "**Syntax Error** 🔴\n\nYou have a typo or incorrect Python syntax. Common causes:\n- Missing colon (:) at the end of if/for/def statements\n- Incorrect indentation\n- Mismatched parentheses or quotes\n\n**Fix:** Check the line number in the error and look for typos or missing punctuation."
        }
        if (error.includes("NameError")) {
          return "**Name Error** 🔴\n\nYou're trying to use a variable or function that doesn't exist. Common causes:\n- Typo in variable name\n- Using a variable before defining it\n- Forgot to import a module\n\n**Fix:** Make sure the variable is defined before you use it, or check for typos."
        }
        if (error.includes("TypeError")) {
          return "**Type Error** 🔴\n\nYou're trying to do an operation with incompatible types. Common causes:\n- Adding a string to a number\n- Calling something that isn't a function\n- Wrong number of arguments to a function\n\n**Fix:** Check the types of your variables and make sure they match what the operation expects."
        }
        if (error.includes("IndentationError")) {
          return "**Indentation Error** 🔴\n\nPython requires consistent indentation. Common causes:\n- Mixing tabs and spaces\n- Incorrect number of spaces\n- Missing indentation after if/for/def\n\n**Fix:** Use 4 spaces for each indentation level and be consistent."
        }
        return `**Error Detected** 🔴\n\nYour Python code has an error. Here's what might help:\n\n${error}\n\n**General Tips:**\n- Read the error message carefully - it often tells you the line number\n- Check for typos in variable and function names\n- Make sure all parentheses and quotes are matched\n- Verify your indentation is correct`
      },

      javascript: (error) => {
        if (error.includes("SyntaxError")) {
          return "**Syntax Error** 🔴\n\nYour JavaScript has a syntax problem. Common causes:\n- Missing semicolon or comma\n- Mismatched brackets { } or parentheses ( )\n- Unclosed string quotes\n\n**Fix:** Check for missing or extra punctuation marks."
        }
        if (error.includes("ReferenceError")) {
          return "**Reference Error** 🔴\n\nYou're trying to use a variable that doesn't exist. Common causes:\n- Typo in variable name\n- Variable not declared with let, const, or var\n- Using a variable outside its scope\n\n**Fix:** Declare your variable before using it, or check for typos."
        }
        if (error.includes("TypeError")) {
          return "**Type Error** 🔴\n\nYou're trying to do something with the wrong type. Common causes:\n- Calling something that isn't a function\n- Accessing a property on null or undefined\n- Wrong number of arguments\n\n**Fix:** Check that your variables have the values you expect."
        }
        return `**Error Detected** 🔴\n\n${error}\n\n**Tips:**\n- Check the console for the line number\n- Look for typos in variable names\n- Make sure all brackets and parentheses match\n- Verify function calls have the right arguments`
      },

      default: (error) => {
        return `**Error Detected** 🔴\n\n${error}\n\n**General Debugging Tips:**\n- Read the error message carefully\n- Check the line number mentioned in the error\n- Look for typos in your code\n- Make sure all syntax is correct for ${language}\n- Try breaking down complex lines into simpler steps\n- Use print/console.log statements to debug`
      },
    }

    const explainer = explanations[language] || explanations.default
    const explanation = explainer(errorMessage)

    return NextResponse.json({
      success: true,
      explanation,
    })
  } catch (error) {
    console.error("[v0] Error explaining error:", error)
    return NextResponse.json({ success: false, error: "Failed to explain error" }, { status: 500 })
  }
}
