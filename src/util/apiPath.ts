import path from 'path-browserify';
import { EndpointProvider } from '../types/Endpoints';

/**
 * Helper function to format API endpoint paths
 * Makes sure paths are formatted the same way everywhere
 *
 * @param {string} endpoint the endpoint name
 * @param {string[]} rest additional path information
 * @returns {string} the API path
 */
export default function apiPath(endpoint: keyof EndpointProvider | 'upload' | 'media', ...rest: string[]): string {
  // TODO
  return `http://localhost:3000/${path.join('api', endpoint, ...rest)}`;
}
