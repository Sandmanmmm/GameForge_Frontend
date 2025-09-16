# 🎮 GameForge Frontend - AI Game Asset Generator

<div align="center">

![GameForge Logo](https://via.placeholder.com/200x80/1f2937/f9fafb?text=GameForge)

[![CI/CD](https://github.com/Sandmanmmm/GameForge_Frontend/workflows/CI%2FCD/badge.svg)](https://github.com/Sandmanmmm/GameForge_Frontend/actions)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=gameforge-frontend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=gameforge-frontend)
[![Performance](https://img.shields.io/badge/lighthouse-95%2B-brightgreen)](https://lighthouse-scores.com)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%202.1%20AA-green)](https://www.w3.org/WAI/WCAG21/Understanding/)

**Production-ready React frontend for GameForge AI game asset generation platform**

[🚀 Live Demo](https://gameforge.app) • [📖 Documentation](./docs) • [🐛 Report Bug](https://github.com/Sandmanmmm/GameForge_Frontend/issues) • [💡 Request Feature](https://github.com/Sandmanmmm/GameForge_Frontend/discussions)

</div>

## ✨ Features

### 🎯 Core Capabilities
- **AI Asset Generation** - Create game assets using advanced AI models
- **Real-time Collaboration** - Work with team members in real-time
- **Asset Management** - Organize and version control your game assets
- **Project Workspace** - Manage multiple game projects seamlessly

### 🔒 Enterprise Security
- **Secure Authentication** - JWT-based auth with refresh tokens
- **Role-based Access Control** - Fine-grained permissions system
- **CORS Protection** - Production-hardened CORS configuration
- **Security Headers** - XSS, CSRF, and content security policies

### 📊 Production Monitoring
- **Error Tracking** - Sentry integration for error monitoring
- **Performance Monitoring** - Real-time performance metrics
- **User Analytics** - Privacy-compliant usage analytics
- **Health Checks** - Comprehensive system health monitoring

### 🌍 Global Ready
- **Internationalization** - Support for English, Spanish, French
- **Feature Flags** - Dynamic feature toggles without deployments
- **Accessibility** - WCAG 2.1 AA compliant
- **Performance** - Lighthouse scores 95+

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+
- **Git** 2.40+

### Installation

```bash
# Clone the repository
git clone https://github.com/Sandmanmmm/GameForge_Frontend.git
cd GameForge_Frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables
# Edit .env.local with your API endpoints and keys

# Start development server
npm run dev
```

The application will be available at http://localhost:3000

### Environment Configuration

Create a .env.local file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=https://api.gameforge.app

# Environment
VITE_NODE_ENV=development

# Feature Flags (Optional)
VITE_FLAGSMITH_ENVIRONMENT_KEY=your_flagsmith_key

# Monitoring (Optional)
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_ANALYTICS=false

# Development Features
VITE_ENABLE_DEBUG_MODE=true
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: React 19 + TypeScript 5.7
- **Build Tool**: Vite 6.3 with SWC
- **Styling**: Tailwind CSS 4.1 + Radix UI
- **State Management**: Zustand + React Query
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod
- **Icons**: Phosphor Icons + Lucide React
- **Animations**: Framer Motion
- **Testing**: Vitest + Playwright + Testing Library

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI primitives
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── services/           # API and external services
│   ├── api/           # API client and types
│   ├── auth/          # Authentication services
│   └── monitoring/    # Error tracking and analytics
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── i18n/              # Internationalization
└── assets/            # Static assets

public/
├── locales/           # Translation files
├── icons/             # Static icons
└── images/            # Static images

tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/               # End-to-end tests
├── a11y/              # Accessibility tests
└── performance/       # Performance tests
```

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run coverage

# Run specific test file
npm test -- ComponentName
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e -- --headed

# Run specific E2E test
npm run test:e2e -- tests/auth.spec.ts
```

### Accessibility Tests

```bash
# Run accessibility tests
npm run test:a11y

# Lint for accessibility issues
npm run lint:a11y
```

### Performance Tests

```bash
# Run performance tests
npm run test:performance

# Generate Lighthouse report
npm run lighthouse

# Performance audit
npm run audit:performance
```

## 🚀 Deployment

### Environment Builds

```bash
# Development build
npm run build

# Staging build
npm run build:staging

# Production build
npm run build:production
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to production
netlify deploy --prod --dir=dist
```

#### Docker

```bash
# Build Docker image
docker build -t gameforge-frontend .

# Run container
docker run -p 80:80 gameforge-frontend
```

### CI/CD Pipeline

The project includes automated CI/CD with:

- ✅ **Code Quality** - ESLint, TypeScript checking
- ✅ **Security Audits** - Dependency vulnerability scanning
- ✅ **Testing** - Unit, integration, E2E, accessibility, performance
- ✅ **Build Verification** - Multi-environment builds
- ✅ **Deployment** - Automated deployment to Vercel
- ✅ **Monitoring** - Sentry release tracking

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code (if Prettier is configured)
npm run format
```

### API Integration

The frontend uses a type-safe API client generated from OpenAPI specifications:

```bash
# Generate API types from backend
npm run generate:api-types

# Start development with API watching
npm run dev:api-watch
```

### Feature Flags

Feature flags allow you to toggle features without deployments:

```typescript
import { useFeatureFlag } from '@/services/featureFlags';

function MyComponent() {
  const isNewFeatureEnabled = useFeatureFlag('enableNewDashboard');
  
  return (
    <div>
      {isNewFeatureEnabled ? <NewDashboard /> : <OldDashboard />}
    </div>
  );
}
```

### Internationalization

Add new translations:

1. Add keys to public/locales/en/*.json
2. Translate to other languages
3. Use in components:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  
  return <h1>{t('welcome')}</h1>;
}
```

## 📈 Performance

### Bundle Size

The application is optimized for minimal bundle size:

- **Gzipped**: ~150KB initial bundle
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Lazy Loading**: Components loaded on demand

### Core Web Vitals

Target metrics:

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay) 
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Performance Budget

- **JavaScript**: Max 300KB
- **CSS**: Max 50KB
- **Images**: Max 500KB per image
- **Total Page**: Max 2MB

## 🔒 Security

### Security Measures

- **Content Security Policy** - Prevents XSS attacks
- **HTTPS Enforcement** - All connections encrypted
- **Secure Headers** - X-Frame-Options, X-Content-Type-Options
- **Input Validation** - All user inputs validated
- **Dependency Scanning** - Regular security audits

### Reporting Security Issues

Please report security vulnerabilities to security@gameforge.app

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (git checkout -b feature/amazing-feature)
3. **Commit** your changes (git commit -m 'Add amazing feature')
4. **Push** to the branch (git push origin feature/amazing-feature)
5. **Open** a Pull Request

### Code Standards

- **TypeScript** - Strict mode enabled
- **ESLint** - Airbnb configuration with accessibility rules
- **Prettier** - Consistent code formatting
- **Conventional Commits** - Semantic commit messages
- **Testing** - Minimum 80% coverage required

## 📄 License

This project is proprietary software owned by GameForge. All rights reserved.

## 🆘 Support

- 📖 **Documentation**: [docs/](./docs)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Sandmanmmm/GameForge_Frontend/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Sandmanmmm/GameForge_Frontend/issues)
- 📧 **Email**: support@gameforge.app

## 🗺️ Roadmap

- [ ] **Q1 2025**: Real-time collaboration features
- [ ] **Q2 2025**: Advanced AI model integration
- [ ] **Q3 2025**: Mobile app development
- [ ] **Q4 2025**: Plugin ecosystem

---

<div align="center">

**Built with ❤️ by the GameForge Team**

[Website](https://gameforge.app) • [Twitter](https://twitter.com/gameforge) • [LinkedIn](https://linkedin.com/company/gameforge)

</div>
