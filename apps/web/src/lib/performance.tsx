import React from "react";

/**
 * Performance Monitoring Utilities
 *
 * Utilities for monitoring and optimizing performance
 */

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string) {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return;
  }

  const startMark = `${componentName}-render-start`;
  const endMark = `${componentName}-render-end`;
  const measureName = `${componentName}-render`;

  performance.mark(startMark);

  return () => {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);

    // const measure = performance.getEntriesByName(measureName)[0];
    // console.log(`[Performance] ${componentName} rendered in ${measure.duration.toFixed(2)}ms`);

    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  };
}

/**
 * Report Web Vitals
 */
interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  [key: string]: unknown;
}

export function reportWebVitals(_metric: WebVitalMetric) {
  if (process.env.NODE_ENV === "development") {
    // console.log('[Web Vitals]', metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Google Analytics
    // window.gtag?.('event', metric.name, {
    //     value: Math.round(metric.value),
    //     event_label: metric.id,
    //     non_interaction: true,
    // });
  }
}

/**
 * Lazy load component with loading state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = React.lazy(importFunc);

  const LazyWrapper = (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );

  LazyWrapper.displayName = `LazyLoad(${importFunc.name || "Component"})`;
  return LazyWrapper;
}

/**
 * Debounce function for performance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Preload image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(preloadImage));
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Intersection Observer for lazy loading
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit,
) {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, options);
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === "undefined" || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType("paint");

  return {
    // Navigation timing
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,

    // Paint timing
    firstPaint:
      paint.find((entry) => entry.name === "first-paint")?.startTime || 0,
    firstContentfulPaint:
      paint.find((entry) => entry.name === "first-contentful-paint")
        ?.startTime || 0,
  };
}

/**
 * Log performance metrics
 */
export function logPerformanceMetrics() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const metrics = getPerformanceMetrics();
  if (!metrics) {
    return;
  }

  // console.group('[Performance Metrics]');
  // console.log('DNS Lookup:', `${metrics.dns.toFixed(2)}ms`);
  // console.log('TCP Connection:', `${metrics.tcp.toFixed(2)}ms`);
  // console.log('Time to First Byte:', `${metrics.ttfb.toFixed(2)}ms`);
  // console.log('Download:', `${metrics.download.toFixed(2)}ms`);
  // console.log('DOM Interactive:', `${metrics.domInteractive.toFixed(2)}ms`);
  // console.log('DOM Complete:', `${metrics.domComplete.toFixed(2)}ms`);
  // console.log('Load Complete:', `${metrics.loadComplete.toFixed(2)}ms`);
  // console.log('First Paint:', `${metrics.firstPaint.toFixed(2)}ms`);
  // console.log('First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)}ms`);
  // console.groupEnd();
}

// Auto-log metrics on load in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.addEventListener("load", () => {
    setTimeout(logPerformanceMetrics, 0);
  });
}
