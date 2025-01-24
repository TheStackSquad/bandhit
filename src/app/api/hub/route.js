//src/app/api/hub/route.js
import Hub from '@/schemas/models/HubModel';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const hubs = await Hub.find({});
      res.status(200).json(hubs);
    } catch (error) {
      console.error('from hub route:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }
}
