// src/lib/ratelimit.ts

// NOTE: This is a placeholder for a real rate limiter.
// In production on Vercel, consider using @upstash/ratelimit.

export const ratelimit = {
  auth: {
    limit: async (_ip: string) => {
      // Placeholder: always allow for now, replace with actual implementation
      return { success: true };
    },
  },
};
