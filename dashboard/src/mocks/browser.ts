import { setupWorker } from "msw/browser";
import { handlers } from "./index";

/**
 * MSW Browser Worker Setup
 *
 * This configures the Mock Service Worker for browser environments.
 * The worker intercepts HTTP requests and responds with mock data,
 * allowing frontend development without a backend.
 *
 * The worker is started conditionally in main.tsx based on the
 * VITE_ENABLE_MSW environment variable.
 *
 * MSW Options:
 * - onUnhandledRequest: 'warn' - Logs warnings for requests without handlers
 *   (useful for identifying missing API endpoints)
 *
 * For more configuration options, see:
 * https://mswjs.io/docs/api/setup-worker
 */

export const worker = setupWorker(...handlers);

/**
 * Start the MSW worker with custom options
 *
 * @param options - Optional configuration for the worker
 * @returns Promise that resolves when the worker is ready
 */
export const startWorker = (options?: Parameters<typeof worker.start>[0]) => {
  return worker.start({
    onUnhandledRequest: "warn",
    ...options,
  });
};
