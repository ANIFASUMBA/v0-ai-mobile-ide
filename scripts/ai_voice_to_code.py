"""
AI Voice to Code
Converts voice descriptions to code snippets
"""

def voice_to_code(description: str, language: str = 'python') -> dict:
    """
    Convert natural language description to code
    
    Args:
        description: Natural language description of what to code
        language: Target programming language
    
    Returns:
        Dictionary with generated code and explanation
    """
    
    # Simple pattern matching for common requests
    patterns = {
        'python': {
            'create a function': {
                'template': '''def {function_name}({params}):
    """
    {description}
    """
    # Your code here
    pass
''',
                'explanation': 'Created a function template with docstring'
            },
            'read a file': {
                'template': '''def read_file(filename):
    """Read contents from a file"""
    try:
        with open(filename, 'r') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None
''',
                'explanation': 'Function to safely read file contents'
            },
            'write to a file': {
                'template': '''def write_file(filename, content):
    """Write content to a file"""
    try:
        with open(filename, 'w') as file:
            file.write(content)
        print(f"Successfully wrote to {filename}")
    except Exception as e:
        print(f"Error writing to file: {e}")
''',
                'explanation': 'Function to write content to a file'
            },
            'make an api call': {
                'template': '''import requests

def fetch_data(url):
    """Fetch data from an API"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

# Example usage
# data = fetch_data('https://api.example.com/data')
''',
                'explanation': 'Function to make HTTP GET requests'
            },
            'create a class': {
                'template': '''class MyClass:
    """
    {description}
    """
    
    def __init__(self, name):
        self.name = name
    
    def __str__(self):
        return f"MyClass: {self.name}"
    
    def method(self):
        """Add your methods here"""
        pass
''',
                'explanation': 'Basic class template with constructor'
            },
            'sort a list': {
                'template': '''# Sort a list
my_list = [3, 1, 4, 1, 5, 9, 2, 6]

# Ascending order
sorted_asc = sorted(my_list)
print("Ascending:", sorted_asc)

# Descending order
sorted_desc = sorted(my_list, reverse=True)
print("Descending:", sorted_desc)

# Sort in place
my_list.sort()
print("Sorted in place:", my_list)
''',
                'explanation': 'Different ways to sort a list in Python'
            },
            'loop through': {
                'template': '''# Loop through items
items = ['apple', 'banana', 'cherry']

# Method 1: Simple loop
for item in items:
    print(item)

# Method 2: With index
for index, item in enumerate(items):
    print(f"{index}: {item}")

# Method 3: While loop
i = 0
while i < len(items):
    print(items[i])
    i += 1
''',
                'explanation': 'Different ways to loop through items'
            }
        }
    }
    
    description_lower = description.lower()
    lang_patterns = patterns.get(language, {})
    
    # Find matching pattern
    for pattern, code_info in lang_patterns.items():
        if pattern in description_lower:
            return {
                'code': code_info['template'],
                'explanation': code_info['explanation'],
                'language': language,
                'matched_pattern': pattern
            }
    
    # Default response if no pattern matches
    return {
        'code': f'# {description}\n# Start coding here!\n\n',
        'explanation': 'No specific template found. Here\'s a starting point.',
        'language': language,
        'matched_pattern': 'default'
    }

# Example usage
if __name__ == '__main__':
    test_descriptions = [
        "create a function to calculate sum",
        "read a file and print contents",
        "make an api call to get user data",
        "sort a list of numbers"
    ]
    
    for desc in test_descriptions:
        result = voice_to_code(desc)
        print(f"\n{'='*60}")
        print(f"Description: {desc}")
        print(f"Explanation: {result['explanation']}")
        print(f"\nGenerated Code:")
        print(result['code'])
