// Animation utilities and configurations for FLEXAI

/**
 * Easing functions for smooth animations
 */
export const easingFunctions = {
  // Standard easing curves
  linear: (t: number): number => t,
  easeIn: (t: number): number => t * t,
  easeOut: (t: number): number => t * (2 - t),
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Cubic easing
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  // Quartic easing
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t: number): number => 
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  
  // Elastic easing
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  // Bounce easing
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
} as const;

/**
 * Animation duration presets (in milliseconds)
 */
export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
} as const;

/**
 * Animation delay presets (in milliseconds)
 */
export const delays = {
  none: 0,
  short: 100,
  medium: 200,
  long: 500,
  longer: 800,
} as const;

/**
 * Stagger timing for sequential animations
 */
export const staggerTimings = {
  tight: 25,
  normal: 50,
  loose: 100,
  relaxed: 150,
} as const;

/**
 * Common animation configurations
 */
export const animationConfigs = {
  fadeIn: {
    duration: durations.normal,
    easing: easingFunctions.easeOutQuart,
    delay: delays.none,
  },
  slideUp: {
    duration: durations.slow,
    easing: easingFunctions.easeOutCubic,
    delay: delays.short,
    distance: 20,
  },
  scaleIn: {
    duration: durations.normal,
    easing: easingFunctions.easeOutBounce,
    delay: delays.none,
    scale: { from: 0.8, to: 1 },
  },
  hoverLift: {
    duration: durations.fast,
    easing: easingFunctions.easeOutQuart,
    scale: 1.05,
    shadow: 'xl',
  },
  textReveal: {
    duration: durations.slow,
    easing: easingFunctions.easeOutCubic,
    stagger: staggerTimings.normal,
  },
  parallax: {
    speed: 0.5,
    direction: 'vertical' as const,
  },
} as const;

/**
 * Utility to check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Utility to check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Utility to check if device is mobile based on screen width
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Request animation frame with fallback
 */
export function requestAnimationFrame(callback: FrameRequestCallback): number {
  if (typeof window === 'undefined') return 0;
  
  return window.requestAnimationFrame || 
         window.webkitRequestAnimationFrame || 
         ((callback) => setTimeout(callback, 16));
}

/**
 * Cancel animation frame with fallback
 */
export function cancelAnimationFrame(id: number): void {
  if (typeof window === 'undefined') return;
  
  const cancel = window.cancelAnimationFrame || 
                 window.webkitCancelAnimationFrame || 
                 clearTimeout;
  
  cancel(id);
}

/**
 * Create a throttled function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Create a debounced function for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Animation state manager
 */
export class AnimationManager {
  private animations: Map<string, { cancel: () => void }> = new Map();
  
  /**
   * Register an animation with a unique ID
   */
  register(id: string, cancelFn: () => void): void {
    // Cancel existing animation with same ID
    this.cancel(id);
    
    this.animations.set(id, { cancel: cancelFn });
  }
  
  /**
   * Cancel a specific animation
   */
  cancel(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.cancel();
      this.animations.delete(id);
    }
  }
  
  /**
   * Cancel all animations
   */
  cancelAll(): void {
    this.animations.forEach(animation => animation.cancel());
    this.animations.clear();
  }
  
  /**
   * Check if animation is running
   */
  isRunning(id: string): boolean {
    return this.animations.has(id);
  }
}

/**
 * Global animation manager instance
 */
export const globalAnimationManager = new AnimationManager();

/**
 * Intersection Observer utility for scroll-triggered animations
 */
export function createScrollObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Performance-optimized scroll handler
 */
export function createScrollHandler(
  callback: (scrollY: number, direction: 'up' | 'down') => void
): () => void {
  let lastScrollY = 0;
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? 'down' : 'up';
        
        callback(currentScrollY, direction);
        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

/**
 * CSS custom property animation utility
 */
export function animateCustomProperty(
  element: HTMLElement,
  property: string,
  from: number,
  to: number,
  duration: number = durations.normal,
  easing: (t: number) => number = easingFunctions.easeOutQuart
): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      element.style.setProperty(property, String(to));
      resolve();
      return;
    }
    
    let startTime: number | null = null;
    
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      
      const currentValue = from + (to - from) * easedProgress;
      element.style.setProperty(property, String(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
}