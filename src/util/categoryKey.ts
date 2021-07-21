import enUS from '../frontend/translations/en-US.json';

/**
 * Returns a category name as a type-safe category key
 *
 * @param {string} categoryName the category name
 * @returns {string} the type-safe key
 */
export default function categoryKey(categoryName: string): keyof typeof enUS['categories'] {
  return categoryName as keyof typeof enUS['categories'];
}
