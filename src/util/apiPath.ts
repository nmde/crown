import { EndpointProvider } from '../types/Endpoints';

/**
 * Helper function to format API endpoint paths
 * Makes sure paths are formatted the same way everywhere
 */
export default function apiPath(endpoint: keyof EndpointProvider | 'media'): string {
  return `/api/${endpoint}`;
}
