"""
AI Error Explainer
Explains programming errors in beginner-friendly terms
"""

import re

def explain_error(error_message: str, language: str = 'python') -> dict:
    """
    Explain programming errors in simple terms
    
    Args:
        error_message: The error message from the interpreter/compiler
        language: Programming language
    
    Returns:
        Dictionary with explanation and suggestions
    """
    
    error_patterns = {
        'python': {
            r'NameError.*name.*is not defined': {
                'explanation': 'You\'re trying to use a variable or function that doesn\'t exist yet.',
                'suggestion': 'Make sure you\'ve defined the variable before using it, or check for typos in the name.',
                'example': 'x = 10  # Define it first\nprint(x)  # Then use it'
            },
            r'SyntaxError.*invalid syntax': {
                'explanation': 'There\'s a mistake in how you wrote your code. Python doesn\'t understand the syntax.',
                'suggestion': 'Check for missing colons (:), parentheses, or quotes. Make sure your indentation is correct.',
                'example': 'if x > 5:  # Don\'t forget the colon!\n    print("Greater")'
            },
            r'IndentationError': {
                'explanation': 'Your code indentation is incorrect. Python uses indentation to understand code blocks.',
                'suggestion': 'Make sure all code in the same block has the same indentation (usually 4 spaces).',
                'example': 'def my_function():\n    print("Correct indentation")\n    return True'
            },
            r'TypeError.*unsupported operand': {
                'explanation': 'You\'re trying to perform an operation on incompatible data types.',
                'suggestion': 'Check the types of your variables. You might need to convert them first.',
                'example': 'age = "25"  # String\nage = int(age)  # Convert to number\nprint(age + 5)  # Now it works!'
            },
            r'IndexError.*list index out of range': {
                'explanation': 'You\'re trying to access a position in a list that doesn\'t exist.',
                'suggestion': 'Remember that lists start at index 0. Check the length of your list first.',
                'example': 'my_list = [1, 2, 3]\nprint(len(my_list))  # Length is 3\nprint(my_list[2])  # Last item is at index 2'
            },
            r'KeyError': {
                'explanation': 'You\'re trying to access a dictionary key that doesn\'t exist.',
                'suggestion': 'Use .get() method or check if the key exists first.',
                'example': 'my_dict = {"name": "John"}\nprint(my_dict.get("age", "Not found"))  # Safe way'
            },
            r'ImportError|ModuleNotFoundError': {
                'explanation': 'Python can\'t find the module you\'re trying to import.',
                'suggestion': 'Make sure the package is installed. You might need to run: pip install package_name',
                'example': '# First install: pip install requests\nimport requests'
            },
            r'ZeroDivisionError': {
                'explanation': 'You\'re trying to divide by zero, which is mathematically undefined.',
                'suggestion': 'Check if the divisor is zero before dividing.',
                'example': 'if divisor != 0:\n    result = number / divisor\nelse:\n    print("Cannot divide by zero")'
            }
        }
    }
    
    patterns = error_patterns.get(language, {})
    
    for pattern, info in patterns.items():
        if re.search(pattern, error_message, re.IGNORECASE):
            return {
                'error_type': pattern,
                'explanation': info['explanation'],
                'suggestion': info['suggestion'],
                'example': info['example'],
                'friendly_message': f"🔍 {info['explanation']}\n\n💡 {info['suggestion']}"
            }
    
    return {
        'error_type': 'Unknown',
        'explanation': 'An error occurred in your code.',
        'suggestion': 'Read the error message carefully and check the line number mentioned.',
        'friendly_message': '🔍 An error occurred. Check the error message for details.'
    }

# Example usage
if __name__ == '__main__':
    test_errors = [
        "NameError: name 'x' is not defined",
        "SyntaxError: invalid syntax",
        "IndentationError: expected an indented block"
    ]
    
    for error in test_errors:
        result = explain_error(error)
        print(f"\nError: {error}")
        print(result['friendly_message'])
        print(f"Example:\n{result['example']}\n")
