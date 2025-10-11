import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { language, projectType } = await request.json()

    const environments: Record<string, Record<string, any>> = {
      python: {
        "web-app": {
          dockerfile: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "app.py"]`,
          requirements: `streamlit==1.28.0
pandas==2.1.0
plotly==5.17.0
requests==2.31.0`,
          setup:
            "1. Install Python 3.11+\n2. Create virtual environment: python -m venv venv\n3. Activate: source venv/bin/activate (Linux/Mac) or venv\\Scripts\\activate (Windows)\n4. Install packages: pip install -r requirements.txt\n5. Run: streamlit run app.py",
        },
        "data-analysis": {
          dockerfile: `FROM python:3.11-slim

WORKDIR /app

RUN pip install pandas numpy matplotlib seaborn jupyter

COPY . .

EXPOSE 8888

CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--allow-root"]`,
          requirements: `pandas==2.1.0
numpy==1.24.0
matplotlib==3.8.0
seaborn==0.13.0
jupyter==1.0.0`,
          setup:
            "1. Install Python 3.11+\n2. Create virtual environment\n3. Install: pip install -r requirements.txt\n4. Launch Jupyter: jupyter notebook",
        },
        "rest-api": {
          dockerfile: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]`,
          requirements: `requests==2.31.0
httpx==0.25.0
pydantic==2.4.0
python-dotenv==1.0.0`,
          setup:
            "1. Install Python 3.11+\n2. Create virtual environment\n3. Install: pip install -r requirements.txt\n4. Run: python main.py",
        },
      },

      javascript: {
        "web-app": {
          dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]`,
          packageJson: {
            name: "web-app",
            version: "1.0.0",
            scripts: {
              start: "node index.js",
              dev: "node --watch index.js",
            },
            dependencies: {
              axios: "^1.6.0",
              lodash: "^4.17.21",
              "date-fns": "^2.30.0",
            },
          },
          setup: "1. Install Node.js 20+\n2. Run: npm install\n3. Start: npm start\n4. Development: npm run dev",
        },
        "rest-api": {
          dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "index.js"]`,
          packageJson: {
            name: "rest-api",
            version: "1.0.0",
            scripts: {
              start: "node index.js",
            },
            dependencies: {
              axios: "^1.6.0",
              qs: "^6.11.2",
              "form-data": "^4.0.0",
              jsonwebtoken: "^9.0.2",
            },
          },
          setup: "1. Install Node.js 20+\n2. Run: npm install\n3. Create .env file\n4. Start: npm start",
        },
      },

      typescript: {
        "web-app": {
          dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]`,
          packageJson: {
            name: "typescript-web-app",
            version: "1.0.0",
            scripts: {
              build: "tsc",
              start: "node dist/index.js",
              dev: "ts-node src/index.ts",
            },
            dependencies: {
              axios: "^1.6.0",
              zod: "^3.22.4",
              "date-fns": "^2.30.0",
            },
            devDependencies: {
              typescript: "^5.2.2",
              "@types/node": "^20.8.0",
              "ts-node": "^10.9.1",
            },
          },
          tsconfig: {
            compilerOptions: {
              target: "ES2020",
              module: "commonjs",
              outDir: "./dist",
              rootDir: "./src",
              strict: true,
              esModuleInterop: true,
            },
          },
          setup:
            "1. Install Node.js 20+\n2. Run: npm install\n3. Development: npm run dev\n4. Build: npm run build\n5. Production: npm start",
        },
      },
    }

    const env = environments[language]?.[projectType] || {
      setup: `Environment setup for ${language} ${projectType}:\n\n1. Install ${language} runtime\n2. Set up your development environment\n3. Install necessary dependencies\n4. Configure your project\n5. Start coding!`,
    }

    return NextResponse.json({
      success: true,
      environment: env,
    })
  } catch (error) {
    console.error("[v0] Error setting up environment:", error)
    return NextResponse.json({ success: false, error: "Failed to setup environment" }, { status: 500 })
  }
}
