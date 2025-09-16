# Production Optimizations & Monitoring

## Bundle Analysis
npm run build:production
npx vite-bundle-analyzer dist

## Performance Monitoring
npm run lighthouse
npm run audit:performance

## Security Scanning
npm audit
npm run lint:security

## Accessibility Compliance
npm run test:a11y
npm run lint:a11y

## Dependency Analysis
npx depcheck
npx npm-check-updates

## Code Quality Metrics
npx eslint . --format=json --output-file=reports/eslint-report.json
npx tsx src/scripts/complexity-analysis.ts

## Performance Budgets
- JavaScript: Max 300KB gzipped
- CSS: Max 50KB gzipped  
- Images: Max 500KB per image
- Total page: Max 2MB
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

## Monitoring Endpoints
- Health: /api/health
- Metrics: /api/metrics  
- Ready: /api/ready
- Version: /api/version
