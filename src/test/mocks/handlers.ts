
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock API handlers for external services
  http.get('/api/test', () => {
    return HttpResponse.json({ message: 'Test API response' });
  }),
];
