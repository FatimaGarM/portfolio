// El panel solo funciona en local (npm run dev). En producción (Vercel)
// /admin y /api/admin/* responden 404.
export const adminEnabled = process.env.NODE_ENV !== "production";
