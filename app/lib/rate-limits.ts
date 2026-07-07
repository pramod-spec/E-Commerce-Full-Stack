// app/lib/rate-limits.ts

// Memory me IPs ko track karne ke liye Map object
const cache = new Map<string, { count: number; expiresAt: number }>();

export async function rateLimit(ip: string, limit = 5) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 Minutes ka time window

  const userData = cache.get(ip);

  // 1. Agar IP pehli baar aaya hai ya 15 mins poore ho chuke hain, toh naya data set karo
  if (!userData || now > userData.expiresAt) {
    cache.set(ip, { count: 1, expiresAt: now + windowMs });
    return { success: true };
  }

  // 2. Agar user limit (5 attempts) cross kar chuka hai, toh block karo
  if (userData.count >= limit) {
    return { success: false };
  }

  // 3. Agar limit ke andar hai, toh counter ko 1 badha do
  userData.count += 1;
  cache.set(ip, userData);
  
  return { success: true };
}