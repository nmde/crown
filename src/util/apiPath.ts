import path from 'path-browserify';
import { EndpointProvider } from '../types/Endpoints';

/**
 * Helper function to format API endpoint paths
 * Makes sure paths are formatted the same way everywhere
 */
export default function apiPath(endpoint: keyof EndpointProvider | 'upload' | 'media', ...rest: string[]): string {
  return path.join('/api', endpoint, ...rest);
}
