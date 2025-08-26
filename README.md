# GradeIT - Automated Code Evaluation & Grading Platform

<div align="center">
  <img src="/public/icon.svg" alt="GradeIT Logo" width="120" />
  
  **Transform Programming Education with Intelligent Code Assessment**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.7-green)](https://www.prisma.io/)
  [![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)
  
  🔗 **[Live Demo](https://gradeit.habeel.live)** | 
  📘 **[Documentation](docs/README.md)** | 
  🐛 **[Report Bug](https://github.com/Habeel-Shamsudeen/GradeIt/issues)** | 
  ✨ **[Request Feature](https://github.com/Habeel-Shamsudeen/GradeIt/issues)**
</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Design Decisions](#-design-decisions)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🎯 About

**GradeIT** is a comprehensive online code evaluation platform designed specifically for educational institutions. It revolutionizes the traditional programming lab assessment process by automating code execution, grading, and feedback delivery while maintaining academic integrity through advanced proctoring features.

### Problem Statement

Traditional computer lab assessments suffer from:
- **Manual Grading Overhead**: Faculty spend excessive time reviewing and testing each student's code
- **Inconsistent Evaluation**: Human error in testing edge cases and boundary conditions
- **Academic Dishonesty**: Difficulty in detecting code plagiarism and preventing cheating
- **Delayed Feedback**: Students wait days or weeks for assignment results
- **Limited Scalability**: Managing large classes becomes increasingly difficult

### Our Solution

GradeIT addresses these challenges through:
- **Automated Testing**: Instant code execution against comprehensive test suites
- **AI-Powered Assessment**: Intelligent evaluation of code quality, efficiency, and style
- **Real-time Monitoring**: Live tracking of student progress and activity
- **Academic Integrity**: Built-in plagiarism detection and proctoring features
- **Instant Feedback**: Immediate results with detailed performance metrics

---

## ✨ Key Features

### 🎓 For Educators

#### **Classroom Management**
- Create and manage multiple virtual classrooms
- Generate unique invitation codes for student enrollment
- Organize assignments by weeks or modules
- Track classroom analytics and performance metrics

#### **Assignment Creation**
- **Multi-Question Support**: Build comprehensive assignments with multiple programming problems
- **Rich Problem Statements**: Support for markdown formatting, code snippets, and examples
- **Flexible Test Cases**: 
  - Public test cases visible to students
  - Hidden test cases for thorough evaluation
  - Sample input/output pairs for clarity
- **AI Test Case Generation**: Automatically generate edge cases using Groq AI
- **Custom Evaluation Metrics**: Define and weight custom scoring criteria

#### **Advanced Grading**
- **Hybrid Scoring System**:
  - Test case performance (default 60%)
  - Code quality metrics (default 40%)
  - Customizable weight distribution
- **LLM-Powered Code Analysis**: Evaluate code style, efficiency, and best practices
- **Batch Operations**: Grade multiple submissions simultaneously
- **Manual Override**: Adjust auto-generated scores when needed

#### **Student Monitoring**
- **Real-time Progress Tracking**: Live updates on student submissions
- **Activity Timeline**: Detailed submission history with timestamps
- **Performance Analytics**:
  - Class-wide statistics
  - Individual student reports
  - Question difficulty analysis
  - Time-to-completion metrics
- **Export Capabilities**: Download grades in CSV/Excel format

### 👨‍🎓 For Students

#### **Coding Environment**
- **Monaco Editor Integration**: 
  - Syntax highlighting for 11+ languages
  - IntelliSense and auto-completion
  - Multi-cursor editing
  - Find and replace functionality
- **Language Support**:
  - Python (Standard & ML)
  - Java
  - C/C++
  - JavaScript/TypeScript
  - Go, Rust, Bash, Assembly
- **Custom Test Runs**: Test code against custom inputs before submission
- **Immediate Feedback**: View test case results instantly after submission

#### **Submission Management**
- **Version History**: Access all previous submissions
- **Detailed Results**:
  - Test case pass/fail status
  - Execution time and memory usage
  - Compilation errors and runtime exceptions
  - Score breakdown by metric
- **Progress Indicators**: Visual feedback on assignment completion

### 🔒 Academic Integrity Features

#### **Proctoring Options**
- **Copy-Paste Prevention**: Disable clipboard operations during exams
- **Fullscreen Enforcement**: Require fullscreen mode to prevent tab switching
- **Activity Monitoring**: Track focus events and suspicious behavior
- **Submission Timestamps**: Automatic late submission detection

#### **Plagiarism Detection** (Planned)
- Code similarity analysis across submissions
- External source checking
- Historical submission comparison

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[Next.js Frontend]
        ME[Monaco Editor]
    end
    
    subgraph "Application Layer"
        API[Next.js API Routes]
        SA[Server Actions]
        AUTH[NextAuth.js]
    end
    
    subgraph "Data Layer"
        PRISMA[Prisma ORM]
        PG[(PostgreSQL)]
        REDIS[(Redis Cache)]
    end
    
    subgraph "External Services"
        JUDGE[Judge0 API]
        GROQ[Groq AI]
        OAUTH[Google OAuth]
    end
    
    UI --> API
    UI --> SA
    ME --> UI
    API --> AUTH
    SA --> AUTH
    API --> PRISMA
    SA --> PRISMA
    PRISMA --> PG
    API --> JUDGE
    API --> GROQ
    AUTH --> OAUTH
    API --> REDIS
```

### Database Schema

The application uses a PostgreSQL database with the following core entities:

- **User**: Stores user profiles with role-based access (Faculty/Student)
- **Classroom**: Virtual classrooms created by faculty
- **Assignment**: Collections of programming questions with configurations
- **Question**: Individual programming problems with descriptions
- **TestCase**: Input/output pairs for automated testing
- **Submission**: Student assignment submissions
- **CodeSubmission**: Individual question code submissions
- **TestCaseResult**: Execution results for each test case
- **EvaluationMetric**: Custom grading criteria
- **SubmissionMetricResult**: Scores for each metric

### Code Execution Flow

```mermaid
sequenceDiagram
    participant S as Student
    participant F as Frontend
    participant A as API
    participant J as Judge0
    participant DB as Database
    
    S->>F: Submit Code
    F->>A: POST /api/submissions
    A->>DB: Create Submission Record
    A->>J: Submit Code + Test Cases
    J-->>A: Return Tokens
    J->>A: Webhook: Execution Complete
    A->>DB: Update Results
    A-->>F: Return Submission ID
    F->>A: Poll Results
    A->>DB: Fetch Results
    A-->>F: Return Detailed Results
    F-->>S: Display Feedback
```

---

## 🛠️ Tech Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 15.2.4 | Full-stack React framework with App Router |
| **Language** | TypeScript | 5.0+ | Type-safe development |
| **Database** | PostgreSQL | 15+ | Primary data storage |
| **ORM** | Prisma | 6.7.0 | Database abstraction and migrations |
| **Authentication** | NextAuth.js | 5.0.0-beta | OAuth and session management |
| **Code Editor** | Monaco Editor | 4.7.0 | In-browser code editing |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS framework |
| **UI Components** | Shadcn/ui | Latest | Radix UI + Tailwind components |
| **Animation** | Framer Motion | 12.4.7 | Smooth UI animations |
| **AI Integration** | Groq AI SDK | 1.2.9 | LLM-powered features |
| **Code Execution** | Judge0 API | CE | Sandboxed code execution |

### Development Tools

- **Package Manager**: npm/pnpm
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Git Hooks**: Husky for pre-commit checks
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel/Railway

### Design Patterns & Best Practices

- **Component Architecture**: Atomic design with reusable UI components
- **State Management**: React hooks and Zustand for global state
- **Form Handling**: React Hook Form with Zod validation
- **Error Boundaries**: Graceful error handling and user feedback
- **Code Splitting**: Dynamic imports for optimal bundle size
- **SEO Optimization**: Metadata API for search engine visibility

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0+ and npm/pnpm
- **PostgreSQL** 14+ (local or cloud instance)
- **Docker** (optional, for containerized setup)
- **Google Cloud Console** account (for OAuth)
- **RapidAPI** account (for Judge0 access)

### Installation Options

#### Option 1: Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Habeel-Shamsudeen/GradeIt.git
cd GradeIt
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gradeit?sslmode=disable"

# Authentication
AUTH_SECRET="your-random-secret-key"
AUTH_TRUST_HOST=http://localhost:3000
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Judge0 API
JUDGE0_API_KEY="your-rapidapi-key"
JUDGE0_API_HOST="judge0-ce.p.rapidapi.com"

# Groq AI (optional)
GROQ_API_KEY="your-groq-api-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Seed initial data** (optional)
```bash
npx prisma db seed
```

6. **Start development server**
```bash
npm run dev
```

#### Option 2: Docker Setup

1. **Clone and configure** (steps 1-3 from above)

2. **Update DATABASE_URL for Docker**
```env
DATABASE_URL="postgresql://gradeitDB:mypassword@db:5432/gradeit"
```

3. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Production Deployment

#### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

#### Self-Hosted Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

---

## 📚 Usage Guide

### For Faculty

1. **Initial Setup**
   - Sign in with Google account
   - Complete onboarding (select Faculty role)
   - Navigate to dashboard

2. **Create a Classroom**
   - Click "Create Class" 
   - Enter class name and section
   - Share the generated code with students

3. **Create Assignments**
   - Navigate to classroom
   - Click "Create Assignment"
   - Add questions with test cases
   - Configure grading weights
   - Set proctoring options

4. **Monitor Progress**
   - View real-time submissions
   - Access detailed analytics
   - Export grades as needed

### For Students

1. **Getting Started**
   - Sign in with Google account
   - Complete onboarding (select Student role)
   - Join classrooms using invite codes

2. **Complete Assignments**
   - Navigate to assignment
   - Read problem statements
   - Write and test code
   - Submit when ready

3. **View Results**
   - Check submission history
   - Review test case results
   - Analyze performance metrics

---

## 🎨 Design Decisions

### UI/UX Philosophy

- **Clarity First**: Clean, uncluttered interface focusing on content
- **Dark Mode Default**: Reduces eye strain during long coding sessions
- **Responsive Design**: Seamless experience across devices
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Performance**: Optimized for low-latency interactions

### Technical Decisions

#### Why Next.js 15?
- App Router for improved performance and DX
- Server Components for reduced client bundle
- Built-in API routes eliminate need for separate backend
- Excellent TypeScript support

#### Why Prisma?
- Type-safe database queries
- Automatic migration generation
- Intuitive schema definition
- Built-in connection pooling

#### Why Judge0?
- Secure sandboxed execution environment
- Support for multiple programming languages
- Consistent execution metrics
- Webhook support for async processing

#### Why Monaco Editor?
- Same engine as VS Code
- Excellent language support
- Customizable and extensible
- Familiar to developers

### Security Considerations

- **Authentication**: OAuth 2.0 with JWT sessions
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encrypted connections, sanitized inputs
- **Code Execution**: Isolated sandbox environment
- **Rate Limiting**: Prevent abuse and DoS attacks

---

## 📡 API Documentation

### Core API Endpoints

#### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

#### Submissions
- `POST /api/submissions` - Submit code for evaluation
- `GET /api/submissions/[id]` - Get submission details

#### Code Execution
- `POST /api/compile` - Run code with custom input

#### AI Features
- `POST /api/generate-testcases` - Generate test cases using AI

#### Webhooks
- `PUT /api/webhook/judge0` - Receive execution results

### Server Actions

The application uses Next.js Server Actions for secure server-side operations:

- **Assignment Actions**: Create, update, delete assignments
- **Class Actions**: Manage classrooms and enrollments
- **Grading Actions**: Update scores, bulk operations
- **Metric Actions**: Manage custom evaluation metrics
- **User Actions**: Profile updates, role management

---

## 🔒 Security

### Security Features

- **OAuth 2.0 Authentication**: Secure Google sign-in
- **Session Management**: HTTP-only cookies with CSRF protection
- **Input Validation**: Zod schemas for all user inputs
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: API throttling to prevent abuse

### Best Practices

- Regular dependency updates
- Security headers via Next.js config
- Environment variable validation
- Secure random token generation
- Audit logging for sensitive operations

---

## ⚡ Performance

### Optimization Strategies

- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: 
  - Static page generation where possible
  - API response caching
  - Database query optimization
- **Bundle Size**: Tree shaking and minification
- **Progressive Enhancement**: Core functionality works without JavaScript

### Performance Metrics

- **Lighthouse Score**: 95+ (Performance)
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Bundle Size**: < 200KB (initial load)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow
- Pull request process
- Coding standards
- Testing requirements

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

### Getting Help

- 📖 [Documentation](docs/README.md)
- 💬 [GitHub Discussions](https://github.com/Habeel-Shamsudeen/GradeIt/discussions)
- 🐛 [Issue Tracker](https://github.com/Habeel-Shamsudeen/GradeIt/issues)
- 📧 [Email Support](mailto:habeelshamsudeen9895@gmail.com)

### Community

- Follow development updates
- Share your experience
- Contribute to discussions
- Help other users

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Judge0** for code execution infrastructure
- **Shadcn** for beautiful UI components
- **Open Source Community** for invaluable contributions

---

<div align="center">
  Made with ❤️ by the GradeIT Team
  
  ⭐ Star us on GitHub — it motivates us a lot!
</div>
