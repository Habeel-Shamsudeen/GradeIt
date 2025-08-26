# Contributing to GradeIT

First off, thank you for considering contributing to GradeIT! 🎉 It's people like you that make GradeIT such a great tool for educators and students alike.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Process](#-development-process)
- [Setting Up Development Environment](#-setting-up-development-environment)
- [Project Structure](#-project-structure)
- [Coding Standards](#-coding-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Community](#-community)
- [Recognition](#-recognition)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at habeelshamsudeen9895@gmail.com. All complaints will be reviewed and investigated promptly and fairly.

---

## 🤔 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
### Description
[Clear and concise description of the bug]

### Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior
[What you expected to happen]

### Actual Behavior
[What actually happened]

### Screenshots
[If applicable, add screenshots]

### Environment
- OS: [e.g. Windows 11, macOS 14, Ubuntu 22.04]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node.js Version: [e.g. 18.17.0]
- Database: [e.g. PostgreSQL 15]

### Additional Context
[Any other context about the problem]
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

**Enhancement Template:**

```markdown
### Problem Statement
[Describe the problem or limitation]

### Proposed Solution
[Describe your proposed solution]

### Alternatives Considered
[Any alternative solutions you've considered]

### Benefits
[How this enhancement benefits users]

### Mockups/Examples
[If applicable, add mockups or examples]

### Implementation Details
[If you have ideas about implementation]
```

### 🔧 Your First Code Contribution

Unsure where to begin? Look for these tags in our issues:

- `good-first-issue` - Simple issues perfect for beginners
- `help-wanted` - Issues where we need community help
- `documentation` - Documentation improvements
- `ui/ux` - User interface improvements
- `performance` - Performance optimizations
- `testing` - Test coverage improvements

---

## 🔄 Development Process

### 1. Fork & Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/GradeIt.git
cd GradeIt

# Add upstream remote
git remote add upstream https://github.com/Habeel-Shamsudeen/GradeIt.git
```

### 2. Branch Naming Convention

Create a branch with a descriptive name:

- `feature/` - New features (e.g., `feature/add-export-grades`)
- `fix/` - Bug fixes (e.g., `fix/submission-timeout`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-queries`)
- `docs/` - Documentation (e.g., `docs/api-endpoints`)
- `test/` - Testing (e.g., `test/add-submission-tests`)
- `perf/` - Performance improvements (e.g., `perf/optimize-compilation`)

```bash
git checkout -b feature/your-feature-name
```

### 3. Keep Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## 🛠️ Setting Up Development Environment

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ or Docker
- Git
- VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

### Local Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Database Setup**
```bash
# Using Docker
docker-compose up -d db

# Or use local PostgreSQL
npx prisma migrate dev
```

4. **Seed Data** (optional)
```bash
npx prisma db seed
```

5. **Start Development Server**
```bash
npm run dev
```

### Docker Development

```bash
# Build and start all services
docker-compose up --build

# Run with live reload
docker-compose -f docker-compose.dev.yml up
```

---

## 📁 Project Structure

```
GradeIt/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── (landing)/          # Public landing pages
│   │   ├── api/                # API routes
│   │   ├── _components/        # Page-specific components
│   │   └── styles/             # Global styles
│   ├── lib/                    # Core utilities
│   │   ├── auth.ts            # Authentication config
│   │   ├── prisma.ts          # Database client
│   │   ├── services/          # Business logic services
│   │   ├── types/             # TypeScript type definitions
│   │   └── validators/        # Zod schemas
│   ├── server/                 # Server-side code
│   │   └── actions/           # Server actions
│   └── config/                 # App configuration
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data script
├── public/                     # Static assets
├── docker/                     # Docker configurations
└── tests/                      # Test files
```

### Key Directories

- **`app/_components/`**: Reusable UI components
- **`server/actions/`**: Server-side business logic
- **`lib/services/`**: External service integrations
- **`lib/types/`**: TypeScript type definitions
- **`lib/validators/`**: Input validation schemas

---

## 📝 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Use explicit types
interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const processUser = (user: UserData): ProcessedUser => {
  // Implementation
};

// ❌ Bad: Avoid 'any' type
const processUser = (user: any) => {
  // Implementation
};
```

### React/Next.js Best Practices

```tsx
// ✅ Good: Use functional components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={cn('btn', `btn-${variant}`)}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ✅ Good: Use Server Components where possible
// app/page.tsx
export default async function Page() {
  const data = await fetchData(); // Server-side data fetching
  return <ClientComponent data={data} />;
}
```

### Database Operations

```typescript
// ✅ Good: Use Prisma transactions for related operations
const createAssignment = async (data: AssignmentData) => {
  return await prisma.$transaction(async (tx) => {
    const assignment = await tx.assignment.create({
      data: {
        title: data.title,
        // ...
      }
    });
    
    await tx.question.createMany({
      data: data.questions
    });
    
    return assignment;
  });
};

// ✅ Good: Include proper error handling
try {
  const result = await createAssignment(data);
  return { success: true, data: result };
} catch (error) {
  console.error('Failed to create assignment:', error);
  return { success: false, error: 'Failed to create assignment' };
}
```

### CSS/Styling

```css
/* ✅ Good: Use CSS variables for theming */
.component {
  background: var(--background);
  color: var(--foreground);
  padding: var(--spacing-md);
}

/* ✅ Good: Use Tailwind utility classes */
<div className="bg-background text-foreground p-4 rounded-lg shadow-md">
  Content
</div>

/* ❌ Bad: Avoid inline styles */
<div style={{ backgroundColor: 'white', padding: '16px' }}>
  Content
</div>
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `AssignmentCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile.ts`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)

---

## 📨 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, etc.)

### Examples

```bash
# Feature
feat(assignments): add bulk grading functionality

# Bug fix
fix(auth): resolve session timeout issue

# Documentation
docs(api): update submission endpoint documentation

# Performance
perf(dashboard): optimize student list rendering

# With breaking change
feat(api): restructure response format

BREAKING CHANGE: API responses now use camelCase
```

### Commit Message Rules

1. Use present tense ("add feature" not "added feature")
2. Use imperative mood ("move cursor" not "moves cursor")
3. Limit first line to 72 characters
4. Reference issues and PRs when applicable

---

## 🔀 Pull Request Process

### Before Submitting

1. **Update your branch**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests**
```bash
npm test
npm run lint
npm run type-check
```

3. **Update documentation** if needed

4. **Test manually**
   - Test your changes thoroughly
   - Check for responsive design
   - Verify no console errors

### PR Template

```markdown
## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
[If applicable]

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I've performed self-review
- [ ] I've commented complex code
- [ ] I've updated documentation
- [ ] My changes generate no warnings
- [ ] I've added tests for my features
- [ ] All tests pass locally

## Related Issues
Closes #[issue number]
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainers review code
3. **Testing**: Changes are tested in staging
4. **Merge**: PR is merged to main branch

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- assignment.test.ts

# Run in watch mode
npm run test:watch
```

### Writing Tests

#### Unit Test Example

```typescript
// __tests__/utils/formatDate.test.ts
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });
  
  it('handles null date', () => {
    expect(formatDate(null)).toBe('N/A');
  });
});
```

#### Integration Test Example

```typescript
// __tests__/api/submissions.test.ts
import { POST } from '@/app/api/submissions/route';

describe('POST /api/submissions', () => {
  it('creates submission successfully', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        code: 'print("Hello")',
        questionId: 'test-123',
        language: 'Python'
      })
    });
    
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

### E2E Testing (Playwright)

```typescript
// e2e/assignment.spec.ts
import { test, expect } from '@playwright/test';

test('student can submit assignment', async ({ page }) => {
  await page.goto('/assignments/123');
  await page.fill('[data-testid="code-editor"]', 'print("Hello")');
  await page.click('[data-testid="submit-button"]');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

---

## 📖 Documentation

### Code Documentation

```typescript
/**
 * Creates a new assignment with questions and test cases
 * @param data - Assignment data including title, questions, and settings
 * @param userId - ID of the faculty creating the assignment
 * @returns Created assignment with generated ID
 * @throws {UnauthorizedError} If user is not faculty
 * @throws {ValidationError} If data is invalid
 */
export async function createAssignment(
  data: AssignmentInput,
  userId: string
): Promise<Assignment> {
  // Implementation
}
```

### API Documentation

Document new API endpoints in `docs/api/`:

```markdown
## POST /api/assignments

Creates a new assignment.

### Request
```json
{
  "title": "Week 1 Assignment",
  "questions": [...],
  "dueDate": "2024-12-31T23:59:59Z"
}
```

### Response
```json
{
  "id": "assignment_123",
  "title": "Week 1 Assignment",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Errors
- `400` - Invalid input data
- `401` - Unauthorized
- `500` - Server error
```

### Component Documentation

Use JSDoc and prop descriptions:

```tsx
interface AssignmentCardProps {
  /** Assignment data to display */
  assignment: Assignment;
  /** Whether to show detailed view */
  detailed?: boolean;
  /** Callback when assignment is clicked */
  onClick?: (id: string) => void;
}

/**
 * Displays an assignment card with title, due date, and progress
 * @example
 * <AssignmentCard 
 *   assignment={assignment}
 *   detailed
 *   onClick={handleClick}
 * />
 */
export function AssignmentCard({ 
  assignment, 
  detailed = false, 
  onClick 
}: AssignmentCardProps) {
  // Component implementation
}
```

---

## 👥 Community

### Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/gradeit)
- **Discussions**: Use [GitHub Discussions](https://github.com/Habeel-Shamsudeen/GradeIt/discussions)
- **Stack Overflow**: Tag questions with `gradeit`

### Communication Channels

- **General Discussion**: GitHub Discussions
- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Issues with `enhancement` label
- **Security Issues**: Email security@gradeit.app

### Monthly Contributors Meeting

- First Tuesday of each month
- 3:00 PM UTC
- Virtual meeting link shared in Discord

---

## 🏆 Recognition

### Contributors Wall

We maintain a contributors wall recognizing all contributors:
- Code contributors
- Documentation writers
- Bug reporters
- Feature suggesters
- Community helpers

### Contribution Levels

- 🥉 **Bronze** (1-5 contributions)
- 🥈 **Silver** (6-15 contributions)
- 🥇 **Gold** (16-30 contributions)
- 💎 **Diamond** (31+ contributions)

### Special Recognition

- **Bug Hunter**: Found and reported critical bugs
- **Feature Champion**: Implemented major features
- **Documentation Hero**: Significant documentation contributions
- **Community Leader**: Active in helping others

---

## 📬 Questions?

If you have questions about contributing:

1. Check our [FAQ](docs/FAQ.md)
2. Search existing [issues](https://github.com/Habeel-Shamsudeen/GradeIt/issues)
3. Ask in [Discussions](https://github.com/Habeel-Shamsudeen/GradeIt/discussions)
4. Contact maintainers at habeelshamsudeen9895@gmail.com

---

## 🎉 Thank You!

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in making GradeIT better for everyone.

Happy coding! 🚀

---

<div align="center">
  <strong>Together, we're revolutionizing programming education!</strong>
</div>