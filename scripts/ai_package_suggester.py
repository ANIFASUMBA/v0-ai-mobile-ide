"""
AI Package Suggester
Suggests relevant packages based on project requirements
"""

def suggest_packages(project_type: str, language: str = 'python') -> dict:
    """
    Suggest relevant packages for a project
    
    Args:
        project_type: Type of project (web, data, ml, api, etc.)
        language: Programming language
    
    Returns:
        Dictionary with package suggestions and descriptions
    """
    
    suggestions = {
        'python': {
            'web': [
                {
                    'name': 'flask',
                    'description': 'Lightweight web framework - perfect for beginners',
                    'install': 'pip install flask',
                    'use_case': 'Building simple web applications and APIs'
                },
                {
                    'name': 'fastapi',
                    'description': 'Modern, fast web framework with automatic API docs',
                    'install': 'pip install fastapi uvicorn',
                    'use_case': 'Building high-performance REST APIs'
                },
                {
                    'name': 'requests',
                    'description': 'Simple HTTP library for making API calls',
                    'install': 'pip install requests',
                    'use_case': 'Fetching data from external APIs'
                }
            ],
            'data': [
                {
                    'name': 'pandas',
                    'description': 'Powerful data manipulation and analysis library',
                    'install': 'pip install pandas',
                    'use_case': 'Working with CSV, Excel, and structured data'
                },
                {
                    'name': 'numpy',
                    'description': 'Fundamental package for numerical computing',
                    'install': 'pip install numpy',
                    'use_case': 'Mathematical operations and arrays'
                },
                {
                    'name': 'matplotlib',
                    'description': 'Create static, animated, and interactive visualizations',
                    'install': 'pip install matplotlib',
                    'use_case': 'Creating charts and graphs'
                },
                {
                    'name': 'seaborn',
                    'description': 'Statistical data visualization based on matplotlib',
                    'install': 'pip install seaborn',
                    'use_case': 'Beautiful statistical plots'
                }
            ],
            'ml': [
                {
                    'name': 'scikit-learn',
                    'description': 'Machine learning library with simple API',
                    'install': 'pip install scikit-learn',
                    'use_case': 'Classification, regression, clustering'
                },
                {
                    'name': 'tensorflow',
                    'description': 'Deep learning framework by Google',
                    'install': 'pip install tensorflow',
                    'use_case': 'Neural networks and deep learning'
                },
                {
                    'name': 'pytorch',
                    'description': 'Deep learning framework with dynamic graphs',
                    'install': 'pip install torch',
                    'use_case': 'Research and production ML models'
                }
            ],
            'automation': [
                {
                    'name': 'selenium',
                    'description': 'Browser automation tool',
                    'install': 'pip install selenium',
                    'use_case': 'Web scraping and testing'
                },
                {
                    'name': 'beautifulsoup4',
                    'description': 'HTML/XML parsing library',
                    'install': 'pip install beautifulsoup4',
                    'use_case': 'Extracting data from web pages'
                },
                {
                    'name': 'schedule',
                    'description': 'Simple job scheduling',
                    'install': 'pip install schedule',
                    'use_case': 'Running tasks at specific times'
                }
            ],
            'database': [
                {
                    'name': 'sqlalchemy',
                    'description': 'SQL toolkit and ORM',
                    'install': 'pip install sqlalchemy',
                    'use_case': 'Database operations with Python objects'
                },
                {
                    'name': 'pymongo',
                    'description': 'MongoDB driver for Python',
                    'install': 'pip install pymongo',
                    'use_case': 'Working with MongoDB databases'
                },
                {
                    'name': 'redis',
                    'description': 'Redis client for Python',
                    'install': 'pip install redis',
                    'use_case': 'Caching and real-time data'
                }
            ]
        },
        'javascript': {
            'web': [
                {
                    'name': 'express',
                    'description': 'Fast, minimalist web framework',
                    'install': 'npm install express',
                    'use_case': 'Building web servers and APIs'
                },
                {
                    'name': 'react',
                    'description': 'UI library for building interfaces',
                    'install': 'npm install react react-dom',
                    'use_case': 'Creating interactive user interfaces'
                }
            ]
        }
    }
    
    packages = suggestions.get(language, {}).get(project_type, [])
    
    return {
        'language': language,
        'project_type': project_type,
        'packages': packages,
        'count': len(packages)
    }

def format_suggestions(suggestions: dict) -> str:
    """Format package suggestions for display"""
    output = f"\n📦 Package Suggestions for {suggestions['project_type'].upper()} project\n"
    output += "=" * 60 + "\n\n"
    
    for pkg in suggestions['packages']:
        output += f"✨ {pkg['name']}\n"
        output += f"   {pkg['description']}\n"
        output += f"   💻 Install: {pkg['install']}\n"
        output += f"   🎯 Use case: {pkg['use_case']}\n\n"
    
    return output

# Example usage
if __name__ == '__main__':
    project_types = ['web', 'data', 'ml']
    
    for ptype in project_types:
        suggestions = suggest_packages(ptype)
        print(format_suggestions(suggestions))
