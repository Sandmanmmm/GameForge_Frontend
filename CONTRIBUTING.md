# Contributing to GameForge Frontend

Thank you for your interest in contributing to GameForge! This guide will help you get started with contributing to our frontend application.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Architecture Guidelines](#architecture-guidelines)
- [Performance Considerations](#performance-considerations)
- [Accessibility Requirements](#accessibility-requirements)
- [Security Guidelines](#security-guidelines)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Git 2.40+
- VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Auto Rename Tag
  - Bracket Pair Colorizer

### Local Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/GameForge_Frontend.git
   cd GameForge_Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Setup**
   ```bash
   npm run type-check
   npm run lint
   npm test
   ```

## 🔄 Development Workflow

### Branch Naming Convention

- **Feature**: eature/description-of-feature
- **Bug Fix**: ix/description-of-fix
- **Hotfix**: hotfix/description-of-hotfix
- **Documentation**: docs/description-of-documentation
- **Refactor**: efactor/description-of-refactor

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- eat: New feature
- ix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- efactor: Code refactoring
- 	est: Adding or updating tests
- chore: Build process or auxiliary tool changes

**Examples:**
```
feat(auth): add OAuth2 login support
fix(dashboard): resolve infinite loading state
docs(readme): update installation instructions
test(components): add unit tests for Button component
```

### Development Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our [coding standards](#coding-standards)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run type-check
   npm run lint
   npm test
   npm run test:e2e
   npm run test:a11y
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### TypeScript Guidelines

- **Strict Mode**: Always use TypeScript strict mode
- **Type Safety**: Avoid ny types, use proper type definitions
- **Interfaces**: Prefer interfaces over types for object shapes
- **Naming**: Use PascalCase for components, camelCase for functions/variables

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const UserCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ❌ Bad
const userCard = (props: any) => {
  return <div>{props.user.name}</div>;
};
```

### React Component Guidelines

- **Functional Components**: Prefer function components over class components
- **Hooks**: Use custom hooks for reusable logic
- **Props**: Define explicit prop interfaces
- **Default Props**: Use default parameters instead of defaultProps

```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick 
}) => {
  return (
    <button 
      className={tn btn- btn-}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### CSS/Styling Guidelines

- **Tailwind CSS**: Use Tailwind utility classes
- **Component Variants**: Use class-variance-authority for component variants
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Support both light and dark themes

```typescript
// ✅ Good - Using CVA for variants
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

### File Organization

```
src/
├── components/
│   ├── ui/               # Basic UI components
│   │   ├── Button/
│   │   │   ├── index.ts  # Export
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   └── ...
│   ├── forms/            # Form-specific components
│   └── layout/           # Layout components
├── hooks/                # Custom hooks
│   ├── useApi.ts
│   ├── useAuth.ts
│   └── ...
├── services/             # API and external services
├── types/                # Type definitions
├── utils/                # Utility functions
└── ...
```

## 🧪 Testing Guidelines

### Unit Tests

- **Coverage**: Maintain minimum 80% code coverage
- **Test Structure**: Use Arrange-Act-Assert pattern
- **Mocking**: Mock external dependencies

```typescript
// ✅ Good test structure
describe('Button Component', () => {
  it('should render with correct text', () => {
    // Arrange
    const buttonText = 'Click me';
    
    // Act
    render(<Button>{buttonText}</Button>);
    
    // Assert
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    // Arrange
    const handleClick = vi.fn();
    
    // Act
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    
    // Assert
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### E2E Tests

- **Page Object Model**: Use page objects for E2E tests
- **Data Attributes**: Use data-testid for test selectors
- **Real User Scenarios**: Test actual user workflows

```typescript
// ✅ Good E2E test
test('user can create a new project', async ({ page }) => {
  await page.goto('/dashboard');
  
  await page.click('[data-testid="create-project-button"]');
  await page.fill('[data-testid="project-name-input"]', 'My New Project');
  await page.click('[data-testid="submit-button"]');
  
  await expect(page.locator('[data-testid="project-card"]')).toContainText('My New Project');
});
```

### Accessibility Tests

- **axe-core**: All components must pass axe accessibility tests
- **Keyboard Navigation**: Test keyboard-only navigation
- **Screen Reader**: Test with screen reader announcements

## 🔄 Pull Request Process

### Before Submitting

1. **Self Review**: Review your own code first
2. **Tests**: Ensure all tests pass
3. **Documentation**: Update relevant documentation
4. **Changelog**: Add entry to CHANGELOG.md if applicable

### PR Template

When creating a PR, please use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Accessibility tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one approval required
3. **Manual Testing**: QA team review for significant changes
4. **Merge**: Squash and merge to main branch

## 🐛 Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Screenshots
Add screenshots if applicable

## Environment
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone X, Desktop]
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
What other solutions were considered?

## Additional Context
Any other context or screenshots
```

## 🏗️ Architecture Guidelines

### Component Architecture

- **Single Responsibility**: Each component should have one clear purpose
- **Composition**: Prefer composition over inheritance
- **Props Interface**: Clear and minimal props interface
- **Error Boundaries**: Wrap components that might error

### State Management

- **Local State**: Use useState for component-local state
- **Shared State**: Use Zustand for application state
- **Server State**: Use React Query for server state
- **Form State**: Use React Hook Form for forms

### API Integration

- **Type Safety**: Use generated types from OpenAPI schema
- **Error Handling**: Consistent error handling across all API calls
- **Loading States**: Proper loading and error states
- **Caching**: Appropriate caching strategies

## ⚡ Performance Considerations

### Bundle Size

- **Code Splitting**: Split code at route level
- **Lazy Loading**: Lazy load non-critical components
- **Tree Shaking**: Avoid importing entire libraries
- **Bundle Analysis**: Regular bundle size monitoring

### Runtime Performance

- **React.memo**: Memoize expensive components
- **useMemo/useCallback**: Memoize expensive calculations
- **Virtual Scrolling**: For large lists
- **Image Optimization**: Proper image formats and sizes

### Core Web Vitals

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## ♿ Accessibility Requirements

### WCAG Compliance

- **Level AA**: All features must meet WCAG 2.1 AA
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and descriptions
- **Color Contrast**: Minimum 4.5:1 contrast ratio

### Implementation

- **Semantic HTML**: Use semantic HTML elements
- **ARIA Labels**: Proper ARIA attributes
- **Focus Management**: Logical focus order
- **Error Messages**: Accessible error announcements

## 🔒 Security Guidelines

### Input Validation

- **Client + Server**: Validate on both client and server
- **Sanitization**: Sanitize all user inputs
- **XSS Prevention**: Prevent cross-site scripting

### Authentication

- **Token Security**: Secure token storage and transmission
- **Session Management**: Proper session handling
- **Authorization**: Check permissions on all actions

### Dependencies

- **Security Audits**: Regular dependency security audits
- **Updates**: Keep dependencies updated
- **Vulnerability Scanning**: Automated vulnerability scanning

## 🆘 Getting Help

- **Documentation**: Check existing documentation first
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create issues for bugs or feature requests
- **Team Chat**: Internal team communication channels

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

Thank you for contributing to GameForge! 🎮✨
