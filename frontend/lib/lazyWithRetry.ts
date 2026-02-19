import { lazy, ComponentType } from "react";

type ComponentImport<T> = () => Promise<{ default: T }>;

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRetryDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, maxDelay);
}

async function importWithRetry<T>(
  importFn: ComponentImport<T>,
  options: Required<RetryOptions>
): Promise<{ default: T }> {
  const { maxRetries, baseDelayMs, maxDelayMs } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await importFn();
      
      if (attempt > 0) {
        console.log(`[LazyRetry] Successfully loaded module after ${attempt} retries`);
      }
      
      return result;
    } catch (error) {
      lastError = error as Error;
      
      const isRateLimited = 
        lastError.message?.includes('429') ||
        lastError.message?.includes('rate limit') ||
        lastError.message?.includes('Too Many Requests');
      
      const isNetworkError = 
        lastError.message?.includes('Failed to fetch') ||
        lastError.message?.includes('dynamically imported module') ||
        lastError.message?.includes('Loading chunk') ||
        lastError.message?.includes('NetworkError');

      if (attempt < maxRetries && (isRateLimited || isNetworkError)) {
        const delay = isRateLimited 
          ? getRetryDelay(attempt, baseDelayMs * 2, maxDelayMs)
          : getRetryDelay(attempt, baseDelayMs, maxDelayMs);
        
        console.warn(
          `[LazyRetry] Attempt ${attempt + 1}/${maxRetries + 1} failed. ` +
          `Retrying in ${Math.round(delay)}ms...`,
          { error: lastError.message, isRateLimited, isNetworkError }
        );
        
        await sleep(delay);
      } else if (attempt === maxRetries) {
        console.error(
          `[LazyRetry] All ${maxRetries + 1} attempts failed. Giving up.`,
          lastError
        );
      }
    }
  }

  throw lastError || new Error('Failed to load module after retries');
}

export function lazyWithRetry<T extends ComponentType<unknown>>(
  importFn: ComponentImport<T>,
  options?: RetryOptions
): ReturnType<typeof lazy> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  return lazy(() => importWithRetry(importFn, mergedOptions));
}

export default lazyWithRetry;
