// constant/env.ts
export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://192.168.1.109:8000" // ← your local IP here
    : "https://voice-memc-backend1.onrender.com";
