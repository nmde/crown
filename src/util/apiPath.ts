import path from 'path-browserify';
import { Endpoint } from '../types/Endpoints';

/**
 * Helper function to format API endpoint paths
 * Makes sure paths are formatted the same way everywhere
 *
 * @param {string} endpoint the endpoint name
 * @param {string[]} rest additional path information
 * @returns {string} the API path
 */
export default function apiPath(endpoint: Endpoint | 'upload' | 'media', ...rest: string[]): string {
  return path.join('api', endpoint, ...rest);
}
