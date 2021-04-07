/**
 * Re-implementation of Tokenize's currentTokenTime because that one's broken
 *
 * @returns {number} The current token time
 */
export default function currentTokenTime(): number {
  return Math.floor((Date.now() - 1546300800000) / 1000);
}
