// app/api/redis-test/route.js
import { redis } from '@/lib/redis/redisClient';

export async function GET() {
    await redis.set('test', 'Hello from Upstash!');
    const value = await redis.get('test');

    return Response.json({ success: true, value });
}