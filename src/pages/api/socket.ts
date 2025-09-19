// This empty file is required for Next.js to correctly proxy socket requests in development.
// See: https://nextjs.org/docs/api-routes/custom-api-routes#caveats
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).end();
}
