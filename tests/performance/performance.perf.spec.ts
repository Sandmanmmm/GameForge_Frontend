// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Performance Tests @performance', () => {
  test('homepage should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Performance budget: page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              vitals.cls = entry.value;
            }
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback for older browsers
        setTimeout(() => resolve({}), 1000);
      });
    });
    
    // LCP should be under 2.5s (good)
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500);
    }
    
    // FID should be under 100ms (good)
    if (metrics.fid) {
      expect(metrics.fid).toBeLessThan(100);
    }
    
    // CLS should be under 0.1 (good)
    if (metrics.cls) {
      expect(metrics.cls).toBeLessThan(0.1);
    }
  });

  test('dashboard should render efficiently', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for excessive DOM nodes
    const nodeCount = await page.evaluate(() => document.querySelectorAll('*').length);
    expect(nodeCount).toBeLessThan(1500); // Reasonable DOM size
    
    // Check for memory leaks
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        return performance.memory;
      }
      return null;
    });
    
    if (memoryInfo) {
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB
    }
  });

  test('images should be optimized', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        const response = await page.request.get(src);
        const size = parseInt(response.headers()['content-length'] || '0');
        
        // Images should be under 500KB
        expect(size).toBeLessThan(500 * 1024);
      }
      
      // Should have alt text or aria-label
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      expect(alt || ariaLabel).toBeTruthy();
    }
  });
});
